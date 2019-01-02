import React, { Component } from 'react';

export default class Fields extends Component {
    render() {
        return (
            <React.Fragment>
            {
                this.props.fields.map((item)=><div key={item.label}>
                    <label>{item.label}</label>
                    <input type='text' value={item.value} onChange={()=>{}}/>
                </div>)
            }
            </React.Fragment>
        )
    }
}