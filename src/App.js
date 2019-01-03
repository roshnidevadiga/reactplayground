import React, { Component } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import checkPropTypes from 'check-prop-types';
import PropTypes from 'prop-types';
import componentsPath from './filePaths';
import getPropsValue from './extractPropTypes.js';


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
            <a style={{cursor: 'pointer'}} name={path} onClick={this.renderSelectedComponent}> 
              {path.substring(path.lastIndexOf('/')+1).split('.')[0]}
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
                    </div>
                ))}
                </React.Fragment>
            )}
            </div>
        );
    }
}

export default App;
