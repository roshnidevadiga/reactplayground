import checkPropTypes from 'check-prop-types';


const defaultValueMappingsRequired = {
    string: 'test',
    boolean: false,
    function: () => alert('Clicked')
};

const defaultValueMappings = {
    string: '',
    boolean: false,
    function: () => {}
};

const getPropType = (propTypes, propName) => {
    let fakeProps = {};
    fakeProps[propName] = "dummy";
    let propObj = {
        [propName]: propTypes[propName]
    }
    let error = checkPropTypes(propObj, fakeProps, 'prop');
    console.log(error);
    // extract type from error string
    if (error !== undefined && !error.includes('undefined')) {
        const EXPECTED_TYPE_PATTERN = /expected `(\w+)`/i;;
        let ab = error.toString().match(EXPECTED_TYPE_PATTERN)
        if(ab && ab.length) {
            return ab[1];
        }
        return ;
    } else {
        // no error - it is string
        return 'string';
    }
};

const getPropIsRequired = (propTypes, propName) => {
    let fakeProps = {};
    fakeProps[propName] = null;
    let propObj = {
        [propName]: propTypes[propName]
    }
    let error =  checkPropTypes(propObj,fakeProps, 'prop');
    return !!error;
};

const extractTypes = (component) => {
    let type_map = {};
    let propTypes = component.propTypes;
    Object.keys(propTypes).forEach((propName) => {
        let type = getPropType(propTypes, propName);
        let required = getPropIsRequired(propTypes, propName)
        type_map[propName]= {
            type:type,
            required:required
        }
    });
    return type_map;
};


const getPropsValue = (component, prop) => {
    let typesObj = extractTypes(component);
    let propValue;
    if(typesObj[prop].required) {
        propValue = defaultValueMappingsRequired[typesObj[prop].type];
    } else {
        propValue = defaultValueMappings[typesObj[prop].type];
    }
    return propValue
}

export default getPropsValue;
