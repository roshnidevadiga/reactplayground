import React from "react";
import PropTypes from 'prop-types';

const List = (props) => {

    return (
        <div className={props.customClass}>
            {
                props.listItems.map(item=>(
                    <div key={item.name} className='row'>
                        <div className='col-md-6'>
                            {item.name}
                        </div>
                        <div className='col-md-6'>
                            {item.value}
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

List.defaultProps = {
    customClass: '',
    listItems: [
        {
            name: 'ab name',
            value: 'ab value'
        },
        {
            name: 'cd name',
            value: 'cd value'
        }
    ]
}

List.propTypes = {
    customClass: PropTypes.string,
    listItems: PropTypes.array
};

export default List;