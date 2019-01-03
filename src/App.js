import React, { Component } from "react";
import "./App.css";
import Button from "./components/button";
import Fields from "./fields";
import "bootstrap/dist/css/bootstrap.min.css";

import checkPropTypes from 'check-prop-types';
import PropTypes from 'prop-types';

class App extends Component {
  state = {
    // props: [],
    props: {},
    // reqProps: {
    //   title: "Test",
    //   onClick: () => alert("Clicked"),
    //   disabled: false,
    //   size: "sm",
    //   title: "Test",
    //   customClasses: ""
    // },
    // updatedProps: {}
  };
  defaultValueMappingsRequired = {
    string: 'test',
    boolean: false,
    function: () => alert('Clicked')
  };
  defaultValueMappings = {
    string: '',
    boolean: false,
    function: () => {}
  };
  componentDidMount() {
    let propsObj = {};
    for (let prop in Button.propTypes) {
      propsObj[prop] = Button.defaultProps[prop]
        ? Button.defaultProps[prop]
        : this.getPropsValue(prop);
    }
    this.setState({
      props: propsObj
    });
  }
  getPropsValue = (prop) => {
    let typesObj = this.extractTypes(Button);
    let propValue;
    if(typesObj[prop].required) {
      propValue = this.defaultValueMappingsRequired[typesObj[prop].type];
    } else {
      propValue = this.defaultValueMappings[typesObj[prop].type];
    }
    return propValue
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
  getPropType(propTypes, propName) {
    let fakeProps = {};
    fakeProps[propName] = "dummy";
    let propObj = {
      [propName]: propTypes[propName]
    }
    let error = checkPropTypes(propObj, fakeProps, 'prop');
    console.log(error);
    // extract type from error string
    if (error !== undefined && !error.includes('undefined')) {
        const EXPECTED_TYPE_PATTERN = /expected `(\w+)`/i;;
        let ab = error.toString().match(EXPECTED_TYPE_PATTERN)
        if(ab && ab.length) {
          return ab[1];
        }
        return ;
    } else {
        // no error - it is string
        return 'string';
    }
}

getPropIsRequired(propTypes, propName){
    let fakeProps = {};
    fakeProps[propName] = null;
    let propObj = {
      [propName]: propTypes[propName]
    }
    let error =  checkPropTypes(propObj,fakeProps, 'prop');
    return !!error;
};

extractTypes(component) {
    let type_map = {};
    let propTypes = component.propTypes;
    Object.keys(propTypes).forEach((propName) => {
    let type = this.getPropType(propTypes, propName);
    let required = this.getPropIsRequired(propTypes, propName)
    type_map[propName]= {
        type:type,
        required:required
        }
    });
    return type_map;
}
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
