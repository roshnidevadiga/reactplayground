import React, { Component } from "react";
import "./App.css";
import Button from "./components/button";
import Fields from "./fields";
import "bootstrap/dist/css/bootstrap.min.css";

import getPropsValue from './extractPropTypes.js';

class App extends Component {
    state = {
        props: {},
    };
    componentDidMount() {
        let propsObj = {};
        for (let prop in Button.propTypes) {
            propsObj[prop] = Button.defaultProps[prop]
                ? Button.defaultProps[prop]
                : getPropsValue(Button, prop);
        }
        this.setState({
            props: propsObj
        });
    }
    updateComponent = (e) => {
        let value = e.target.value;
        if(e.target.value=='true' || e.target.value=='false') {
            if(e.target.value=='true') {
                value = true;
            } else {
                value = false;
            }
        }

        // if(e.target.value.includes('_function()')) {
        //   value = eval(value);
        // }
        this.setState({
            props: {
                ...this.state.props,
                [e.target.name]: value
            }
        });
    };

    render() {
        console.log(this.state.props);
        let {props} = this.state;
        return (
            <div className="App">
            {Object.keys(props).length>0 && (
                <React.Fragment>
                <Button {...this.state.props}/>

                {Object.keys(props).map(item => (
                    <div key={item}>
                    <label>{item}</label>
                    {
                        typeof props[item]==='string' && <input
                        type="text"
                        name={item}
                        value={this.state.props[item]}
                        onChange={this.updateComponent}
                        />
                    }
                    {
                        typeof props[item]==='function' && (
                            <React.Fragment>
                            <textarea name={item} onChange={this.updateComponent} value={this.state.props[item].toString()}/>
                            </React.Fragment>
                        )
                    }
                    {
                        typeof props[item]==='boolean' && (
                            <React.Fragment>
                            <input type='radio' value={true} name={item} checked={this.state.props[item]===true? true: false} onChange={this.updateComponent}/> true
                            <input type='radio' value={false} name={item} checked={this.state.props[item]===false? true: false} onChange={this.updateComponent}/> false
                            </React.Fragment>
                        )
                    }
                    {/* <input
                  type="text"
                  name={item}
                  value={this.state.props[item]}
                  onChange={this.updateComponent}
                /> */}
                    {/* <input type='text' value={this.state.props[item]} onChange={(e)=>this.updateComponent(item, this.state.props[item], e)}/> */}
                    </div>
                ))}
                </React.Fragment>
            )}
            </div>
        );
    }
}

export default App;
