import React, { Component } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import checkPropTypes from 'check-prop-types';
import PropTypes from 'prop-types';
import componentsPath from './filePaths';
import getPropsValue , {getPropIsRequired} from './extractPropTypes';

class App extends Component {
    state = {
        props: {},
        currentComponent: null
    };
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
        for (let prop in component.propTypes) {
            propsObj[prop] = component.defaultProps[prop]
                ? component.defaultProps[prop]
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
        .then(component =>
            this.setInitialProps(component.default)
        )
        .catch(error => {
            console.error(`"${path}" not yet supported`);
        });
  }
  getComponentName = (path) => {
      let componentName = path.substring(path.lastIndexOf('/') + 1).split('.')[0];
      return String.fromCharCode(componentName.charCodeAt(0) - 32) + componentName.slice(1);
  }
  onApply =()=>{
    let object ={};
    let requiredPresentFlag =true;
    for(var item in this.state.props){
      if(typeof this.state.props[item]==='boolean'){
        object[item] = this.refs[item].checked;
      }
      else if(typeof this.state.props[item] === 'string'){
        object[item] = this.refs[item].value;
      } else if(typeof this.state.props[item] === 'object') {
        object[item] = JSON.parse(this.refs[item].value);
      }
      let isRequired = getPropIsRequired(this.state.currentComponent.propTypes, item);
      if(isRequired && object[item]===""){
        requiredPresentFlag =false;
        alert(`${item} is required.`)
        break;
      }
    }
    requiredPresentFlag && this.setState({
      props:{
        ...this.state.props,
        ...object
      }
    });
  }

  render() {
    console.log(this.state.props);
    let { props } = this.state;
    let componentsElements = null;
    if (this.state.currentComponent) {
        componentsElements = <this.state.currentComponent {...this.state.props} />;
    }
    return (
        <div className="App d-flex">
            <div id="rp-sidebar">
                <nav id="rp-sidebar" className="bg-light">
                    <div className="p-3">Component List</div>
                    <ul className="list-unstyled components">
                        {
                            componentsPath.map(path => (
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
            <div id="rp-content" className="text-center container-fluid">
                {Object.keys(props).length > 0 && (
                    <React.Fragment>
                        <div className="container-fluid mb-4 text-center">
                            <h3>Component</h3>
                            <div>
                                {
                                    componentsElements
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <h3>Props</h3>
                                {Object.keys(props).map((item, index) => (
                                    <div key={item}>
                                        <label>{item}</label>
                                        {
                                            typeof props[item]==='string' && <input
                                            type="text"
                                            name={item}
                                            key={this.state.currentComponent.toString()+index}
                                            defaultValue={this.state.props[item]}
                                            ref={item}
                                            />
                                        }
                                        {
                                            typeof props[item]==='function' && (
                                              <React.Fragment>
                                              <textarea key={this.state.currentComponent.toString()+index} readOnly name={item} defaultValue={this.state.props[item].toString()} ref={item}/>
                                              </React.Fragment>
                                          )
                                        }
                                        {
                                            typeof props[item]==='boolean' && (
                                              <React.Fragment>
                                              <input key={this.state.currentComponent.toString()+index} type='checkbox' defaultChecked={this.state.props[item]===false? false: true} onChange={()=> console.log("true")} ref={item}/>
                                              </React.Fragment>
                                          )
                                        }
                                        {
                                            typeof props[item]==='object' && (
                                                <React.Fragment>
                                                <textarea key={this.state.currentComponent.toString()+index} name={item} defaultValue={JSON.stringify(this.state.props[item])} ref={item}/>
                                                </React.Fragment>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>
                            <div className="col">
                                <h3>State</h3>
                            </div>
                        </div>
                        <button onClick={this.onApply}>Apply</button>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
  }
}

export default App;
