import React, { Component } from "react";
import logo from "./logo.svg";
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
    onClick: () => alert('Clicked')
  };
  defaultValueMappings = {
    string: '',
    boolean: false,
    onClick: () => {}
  };
  componentDidMount() {
    // var componentClass = require('./components/button');
    // console.log(Button.propTypes);
    // console.log(Button.defaultProps);

    // console.log(extractPropTypes);
    // console.log(PropTypes);
    let typesObj = this.extractTypes(Button);
    console.log(typesObj);
    let propsObj = {};
    for (let prop in Button.propTypes) {
      propsObj[prop] = Button.defaultProps[prop]
        ? Button.defaultProps[prop]
        : typesObj[prop].required ? this.defaultValueMappingsRequired[typesObj[prop].type]: this.defaultValueMappings[typesObj[prop].type];
      // propsArray.push({
      //   label: prop,
      //   value: (Button.defaultProps[prop]) ? Button.defaultProps[prop]: ''
      // });
    }
    this.setState({
      props: propsObj
    });

    
    // console.log(typesObj);
  }
  updateComponent = (e, item, value) => {
    this.setState({
      props: {
        ...this.state.props,
        [e.target.name]: e.target.value
      }
    });
  };
  getPropType(propTypes, propName) {
    let fakeProps = {};
    fakeProps[propName] = "dummy";
    let propObj = {
      [propName]: propTypes[propName]
    }

    // let error = checkPropTypes(propTypes, fakeProps, 'prop', Button[propName]);
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
    return (
      <div className="App">
        <Button {...this.state.props}/>
        {this.state.props && (
          <React.Fragment>
            {Object.keys(this.state.props).map(item => (
              <div key={item}>
                <label>{item}</label>
                <input
                  type="text"
                  name={item}
                  value={this.state.props[item]}
                  onChange={this.updateComponent}
                />
                {/* <input type='text' value={this.state.props[item]} onChange={(e)=>this.updateComponent(item, this.state.props[item], e)}/> */}
              </div>
            ))}
          </React.Fragment>
        )}
        {/* <Fields fields={this.state.props}/> */}
      </div>
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    );
  }
}

export default App;
