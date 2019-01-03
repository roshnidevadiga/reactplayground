import React from 'react';
import PropTypes from 'prop-types';

const Card = (props) => {
    return (
        <div className = {`card bg-light text-dark ${props.customClass}`}>
            <div className='card-body'>
                <h3>
                {
                    props.title
                }
                </h3>
                <h4>
                {
                    props.subTitle
                }
                </h4>
            </div>
        </div>
    );
};


Card.defaultProps = {
    customClass: '',
    title: 'This is title',
    subTitle: 'This is sub title'
};
Card.propTypes = {
    customClass: PropTypes.string,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string
};

export default Card;