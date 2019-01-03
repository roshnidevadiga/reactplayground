import React from "react";
import PropTypes from 'prop-types';

const List = (props) => {
    return (
        <div className={props.customClass}>
            {
                props.title
            }
        </div>
    );
};

List.defaultProps = {
    customClass: '',
    title: 'Test'
}

List.propTypes = {
    customClass: PropTypes.string,
    title: PropTypes.string
};

export default List;