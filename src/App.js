import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import checkPropTypes from 'check-prop-types';
import PropTypes from 'prop-types';
import {componentPaths, cssPaths} from './filePaths';
import getPropsValue , {getPropIsRequired} from './extractPropTypes';

class App extends Component {
    state = {
        props: {},
        currentComponent: null,
        states: null
    };
    constructor(){
        super();
        cssPaths.map(path => {
            import(`../${path}`);
        })
    }
    defaultValueMappingsRequired = {
        string: 'test',
        boolean: false,
        function: () => alert('Clicked')
    };
    defaultValueMappings = {
        string: '',
        boolean: false,
        function: () => { }
    };
    setInitialProps = (component) => {
        let propsObj = {};
        let componentDefaultProps = component.defaultProps || {};
        for (let prop in component.propTypes) {
            propsObj[prop] = componentDefaultProps[prop]
                ? componentDefaultProps[prop]
                : getPropsValue(component, prop);
        }
        this.setState({
            props: propsObj,
            currentComponent: component
        });
    }
    renderSelectedComponent = async e => {
        const path = e.target.name;
        console.log(`Loading ${path} component...`);

        import(`../${path}`)
            .then(component => {
                this.setInitialProps(component.default);
                this.setCurrentComponentStates(this.currentStatefullComponent);
            }
            )
            .catch(error => {
                console.error(`"${path}" not yet supported`);
            });
    }
    getComponentName = (path) => {
        let componentName = path.substring(path.lastIndexOf('/') + 1).split('.')[0];
        return String.fromCharCode(componentName.charCodeAt(0) - 32) + componentName.slice(1);
    }
    setCurrentComponentStates = (component) => {
        if (component) {
            this.setState({
                states: component.state
            });
        }
        else {
            this.setState({
                states: null
            });
        }
    }
    isStatelessComponent = ( component ) => {
        return !component.prototype.render;
    }
    onApply = () => {
        let propObject = {},
            stateObject = {};
        let requiredPresentFlag = true;
        for (let item in this.state.props) {
            if (typeof this.state.props[item] === 'boolean') {
                propObject[item] = this.refs[item].checked;
            }
            else if (typeof this.state.props[item] === 'string') {
                propObject[item] = this.refs[item].value;
            } else if (typeof this.state.props[item] === 'object') {
                propObject[item] = JSON.parse(this.refs[item].value);
            }
            let isRequired = getPropIsRequired(this.state.currentComponent.propTypes, item);
            if (isRequired && propObject[item] === "") {
                requiredPresentFlag = false;
                alert(`${item} is required.`)
                break;
            }
        }

        for (let item in this.state.states) {
            if (typeof this.state.states[item] === 'boolean') {
                stateObject[item] = this.refs[item].checked;
            }
            else if (typeof this.state.states[item] === 'string') {
                stateObject[item] = this.refs[item].value;
            } else if (typeof this.state.states[item] === 'object') {
                stateObject[item] = JSON.parse(this.refs[item].value);
            }
        }
        requiredPresentFlag && this.setState({
            props: {
                ...this.state.props,
                ...propObject
            },
            states: {
                ...this.state.states,
                ...stateObject
            }
        });

        this.currentStatefullComponent && this.currentStatefullComponent.setState(stateObject);
    }

    render() {
        let { props, states } = this.state;
        let componentElement = null;
        if (this.state.currentComponent) {
            if (this.isStatelessComponent(this.state.currentComponent)) {
                componentElement = <this.state.currentComponent {...this.state.props} />;
            }
            else {
                componentElement = <this.state.currentComponent
                    {...this.state.props}
                    ref={(currentComponent) => {
                        this.currentStatefullComponent = currentComponent;
                        window.currentStatefullComponent = currentComponent;
                    }}
                />;
            }
        }
        return (
            <div className="App d-flex">
                <div id="rp-sidebar" className="bg-light border-right">
                    <nav>
                        <div className="p-3 sidebar-title">Component List</div>
                        <ul className="list-unstyled components sidebar-list">
                            {
                                componentPaths.map(path => (
                                    <li key={path} className="nav-item">
                                        <a href="#" name={path} onClick={this.renderSelectedComponent} className="nav-link">
                                            {this.getComponentName(path)}
                                        </a>
                                    </li>
                                ))
                            }
                        </ul>
                    </nav>
                </div>
                <div id="rp-content" className="text-center container-fluid py-3">
                    {
                        !componentElement && (<div className="h-100"><h1 className="d-flex align-items-center justify-content-center h-100">React Playground</h1></div>)
                    }
                    {
                        componentElement && <div className="container-fluid mb-4 text-center">
                            <div className="bd-example rounded">{componentElement}</div>
                        </div>
                    }
                    {Object.keys(props).length > 0 && (
                        <React.Fragment>
                            <div className="container-fluid">
                                <div className="row mb-3">
                                    <div className="col-md-6 border py-3">
                                        <h3>Props</h3>
                                        {Object.keys(props).map((item, index) => (
                                            <div key={item} className="row mb-2">
                                                <label className="col-6 text-right">{item}{ getPropIsRequired(this.state.currentComponent.propTypes, item) ? '*': ''}</label>
                                                <div className="col-6 text-left">
                                                    {
                                                        typeof props[item] === 'string' && <input
                                                            type="text"
                                                            name={item}
                                                            className = 'w-100'
                                                            key={this.state.currentComponent.toString() + index}
                                                            defaultValue={this.state.props[item]}
                                                            ref={item}
                                                        />
                                                    }
                                                    {
                                                        typeof props[item] === 'function' && (
                                                            <React.Fragment>
                                                                <textarea className = 'w-100' key={this.state.currentComponent.toString() + index} readOnly name={item} defaultValue={this.state.props[item].toString()} ref={item} />
                                                            </React.Fragment>
                                                        )
                                                    }
                                                    {
                                                        typeof props[item] === 'boolean' && (
                                                            <React.Fragment>
                                                                <input key={this.state.currentComponent.toString() + index} type='checkbox' defaultChecked={this.state.props[item] === false ? false : true} ref={item} />
                                                            </React.Fragment>
                                                        )
                                                    }
                                                    {
                                                        typeof props[item] === 'object' && (
                                                            <React.Fragment>
                                                                <textarea className = 'w-100' key={this.state.currentComponent.toString() + index} name={item} defaultValue={JSON.stringify(this.state.props[item])} ref={item} />
                                                            </React.Fragment>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-md-6 border py-3">
                                        <h3>State</h3>
                                        {states && Object.keys(states).map((item, index) => (
                                            <div key={item} className="row">
                                                <label className="col-6 text-right">{item}</label>
                                                <div className="col-6 text-left">
                                                    {
                                                        typeof states[item] === 'string' && <input
                                                            className = 'w-100'
                                                            type="text"
                                                            name={item}
                                                            key={this.state.currentComponent.toString() + index}
                                                            defaultValue={states[item]}
                                                            ref={item}
                                                        />
                                                    }
                                                    {
                                                        typeof states[item] === 'boolean' && (
                                                            <React.Fragment>
                                                                <input key={this.state.currentComponent.toString() + index} type='checkbox' defaultChecked={states[item] === false ? false : true} ref={item} />
                                                            </React.Fragment>
                                                        )
                                                    }
                                                    {
                                                        typeof states[item] === 'object' && (
                                                            <React.Fragment>
                                                                <textarea className = 'w-100' key={this.state.currentComponent.toString() + index} name={item} defaultValue={JSON.stringify(states[item])} ref={item} />
                                                            </React.Fragment>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button className='btn btn-secondary' onClick={this.onApply}>Apply</button>
                                <div className='text-secondary mt-3 note-text'>Note: * indicates a required prop</div>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}

export default App;
