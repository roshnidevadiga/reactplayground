import React, {Component} from 'react';
import PropTypes from 'prop-types';


class Button extends Component {
    state = {
        test: true
    }
    onClick = (e) => {
        if (this.props.disabled) {
            e.preventDefault();
            return;
        }
      
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }
    render() {
        const { type, size, disabled, title, customClasses} = this.props;
        return (
            <input type="button" className={`btn btn-${type} btn-${size} ${disabled ? 'disabled': ''} ${customClasses}`} 
            onClick={this.onClick} value={title} />
        );
    }
}

Button.defaultProps = {
    type: 'primary  ',
    size: 'sm',
    disabled: false,
    customClasses: ''
};
Button.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    title: PropTypes.string.isRequired,
    customClasses: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

export default Button;