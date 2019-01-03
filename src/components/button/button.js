import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../css/button.css';

class Button extends Component {
    state = {
        hovered: false
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
        const { active, hovered } = this.state;
        return (
            <input type="button" className={`btn btn-${type} btn-${size} ${disabled ? 'disabled': ''} ${hovered ? 'hover': ''} ${customClasses}`} 
            onClick={this.onClick} value={title} />
        );
    }
}

Button.defaultProps = {
    type: 'primary  ',
    size: 'sm',
    disabled: false,
    customClasses: '',
    title: 'Button'
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