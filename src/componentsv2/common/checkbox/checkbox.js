/**
 * This Checkbox component is Controlled component.
 * You must pass value(i.e. checked prop) and onChange function
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function Checkbox( props )  {
    const checked = props.checked === undefined ? false : props.checked;
    const disabled = props.disabled === undefined ? false : props.disabled;

    let containerClass = checked ? "checked" : "";
    containerClass += disabled ? " disabled" : "";

    function handleChange() {
        if ( props.disabled ) {
            return;
        }

        if ( props.onChange ) {
            props.onChange();
        }
    }
    
    return (
        <label className={`crbutton-component ${containerClass}`}>
            <input
                className = "input-checkbox"
                type      = "checkbox"
                name      = { props.name }
                onChange  = { handleChange }
                disabled  = { disabled }
                checked   = { checked }
            />
            <span className="checkbox-background"></span>
            {props.text && <span className="checkbox-text">{props.text}</span>}
        </label>
    );
}

Checkbox.propTypes = {
    name     : PropTypes.string,
    text     : PropTypes.string,
    checked  : PropTypes.bool.isRequired,
    disabled : PropTypes.bool,
    onChange : PropTypes.func.isRequired
}
