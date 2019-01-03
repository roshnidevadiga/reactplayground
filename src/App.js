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
    function: () => {}
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
  updateComponent = (e) => {
    let value = e.target.value;
    if(e.target.value=='true' || e.target.value=='false') {
      if(e.target.value=='true') {
        value = true;
      } else {
        value = false;
      }
    }
    this.setState({
      props: {
        ...this.state.props,
        [e.target.name]: value
      }
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

onApply =()=>{
  let object ={};
  let requiredPresentFlag =true;
  for(var item in this.state.props){
    if(typeof this.state.props[item]==='boolean'){
      object[item] = this.refs[item].checked;
    }
    else if(typeof this.state.props[item] !== 'function'){
      object[item] = this.refs[item].value;
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
  let {props} = this.state;
  let componentsElements = null;
  if(this.state.currentComponent) {
    componentsElements = <this.state.currentComponent {...this.state.props}/>;
  }
  return (
    <div className="App">
    <div>
    {
        componentsPath.map(path=>(
          <div key={path}>
          <a name={path} onClick={this.renderSelectedComponent}> 
            {path}
          </a>
          </div>
        ))
    }
    </div>
    {Object.keys(props).length>0 && (
        <React.Fragment>
          {
            componentsElements
          }

              {Object.keys(props).map(item => (
                  <div key={item}>
                  <label>{item}</label>
                  {
                      typeof props[item]==='string' && <input
                      type="text"
                      name={item}
                      defaultValue={this.state.props[item]}
                      ref={item}
                      />
                  }
                  {
                      typeof props[item]==='function' && (
                          <React.Fragment>
                          <textarea readOnly name={item} defaultValue={this.state.props[item].toString()} ref={item}/>
                          </React.Fragment>
                      )
                  }
                  {
                      typeof props[item]==='boolean' && (
                          <React.Fragment>
                          <input type='checkbox' defaultChecked={this.state.props[item]===false? true: false} onChange={()=> console.log("true")} ref={item}/>
                          </React.Fragment>
                      )
                  }
                  </div>
              ))}
              <button onClick={this.onApply}>Apply</button>
              </React.Fragment>
          )}
          </div>
      );
  }
}

export default App;
