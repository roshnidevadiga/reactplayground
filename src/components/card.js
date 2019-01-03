import React from 'react';
import PropTypes from 'prop-types';

export const Card = (props) => {
    return (
        <div className = {`card-small column card flex flex-align-center flex-vertical ${props.customClass}`}>
            {props.children}
        </div>
    );
};


Card.defaultProps = {
    customClass: ''
};
Card.propTypes = {
    customClass: PropTypes.string
};