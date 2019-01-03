import React from 'react';
import PropTypes from 'prop-types';

const Card = (props) => {
    return (
        <div className = {`card-small column card col-md-5 ${props.customClass}`} style={{minHeight: '90px', margin: '0 auto'}}>
            {props.title}
        </div>
    );
};


Card.defaultProps = {
    customClass: ''
};
Card.propTypes = {
    customClass: PropTypes.string,
    title: PropTypes.string.isRequired
};

export default Card;