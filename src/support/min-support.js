import {kResponseNegative} from './values';
import {
    Description,
    Business,
    Store,
    Build,
    Receipt,
    Phone,
    AccountBalance,
    Code,
    AccountBox,
    Lock,
    Email,
    Edit,
    Visibility,
    Today,
    Apps,
    Done,
    Clear,
    ArrowDropDown,
    Warning,
    Schedule,
} from '@material-ui/icons';
import React from 'react';
import moment from 'moment';
import validator from "validator";
//import 'moment/locale/ro';

export const checkLocation = (location, toVerify) => {
    return (location === toVerify) || (('/' + location ) === toVerify) || (location === ('/' + toVerify));
}

export const renderIf = (condition, element) => {
    if(condition) return element;
    else return null;
};

export const is = (object) => {
    if(object == null)  {
        return false;
    }
    if(typeof object == 'string' && object.length === 0) {
        return false;
    }
    if(typeof object == 'object' && object === {}) {
        return false;
    }
    
    return true;
};

export const updateObject = (object, updatedFields) => {
    return {
        ...object,
        ...updatedFields,
    };
};

export const responseType = (response) => {
    if(is(response) && response.hasOwnProperty('data')) {
        if (is(response.data) && response.data.hasOwnProperty('response')) {
            return response.data.response;
        }
    }
    return kResponseNegative;
};

export const isolateData = (response) => {
    if(response.data.hasOwnProperty('result')) {
        return response.data.result;
    }
    return null;
};

export const range = (from, to) => {
    let result = [];
    for(let i =from; i < to; ++i) {
        result.push(i);
    }
    return result;
};

export const filter = (list, fields, search, deepSearch = false) => {
    search = search + '';
    search = search.toLowerCase();

    if((search.replace(/ /g, '')).length > 0) {
        let reg = new RegExp(search, 'g');
        let result = [];
        let found = false;
        let currentElement;
        for (let i = 0; i < list.length; ++i) {
            found = false;
            for(let j = 0; j < fields.length; ++j) {
                currentElement = list[i];
                if(deepSearch) {
                    let elements = fields[j].split('.');
                    for(let k = 0; k < elements.length; ++k) {
                        if(currentElement.hasOwnProperty(elements[k])) {
                            currentElement = currentElement[elements[k]];
                        } else {
                            currentElement = null;
                            break;
                        }
                    }
                } else {
                    currentElement = currentElement[fields[j]];
                }
                if (currentElement && currentElement.toLowerCase().match(reg)) {
                    found = true;
                    break;
                }
            }
            if(found) {
                result.push(list[i]);
            }
        }
        return result;
    }
    return list;
};

export const prettyDate = (server) => {
    //moment.locale('ro');
    return moment(server).format('DD MMMM YYYY');
};

export const prettyTime = (server) => {
    //moment.locale('ro');
    return moment(server).format('HH:mm');
};

export const prettyDateAndTime = (server) => {
    return prettyDate(server) + ' ora ' + prettyTime(server);
};

export const prettyDuration = (server) => {
    //moment.locale('ro');
    return server.humanize(true);
};

export const smallIcon = (icon, color='#00000066', size='22px') => {
    if(icon) {
        let style = {
            color: color,
            fontSize: size,
            transitionDuration: '1.0s',
        };
        switch (icon) {
            case 'dropdown':
                return (
                    <ArrowDropDown color={color} style={style}/>
                );
            case 'description':
                return (
                    <Description color={color} style={style}/>
                );
            case 'client':
                return (
                    <Business color={color} style={style}/>
                );
            case 'headquarters':
                return (
                    <Store color={color} style={style}/>
                );
            case 'intervention':
                return (
                    <Build color={color} style={style}/>
                );
            case 'beneficiary':
                return (
                    <Receipt color={color} style={style}/>
                );
            case 'phone':
                return (
                    <Phone color={color} style={style}/>
                );
            case 'bank':
                return (
                    <AccountBalance color={color} style={style}/>
                );
            case 'code':
                return (
                    <Code color={color} style={style}/>
                );
            case 'name':
                return (
                    <AccountBox color={color} style={style}/>
                );
            case 'lock':
                return (
                    <Lock color={color} style={style}/>
                );
            case 'email':
                return (
                    <Email color={color} style={style}/>
                );
            case 'edit':
                return (
                    <Edit color={color} style={style}/>
                );
            case 'view':
                return (
                    <Visibility color={color} style={style}/>
                );
            case 'date':
                return (
                    <Today color={color} style={style}/>
                );
            case 'count':
                return (
                    <Apps color={color} style={style}/>
                );
            case 'done':
                return (
                    <Done color={color} style={style}/>
                );
            case 'clear':
                return (
                    <Clear color={color} style={style}/>
                );
            case 'warn':
                return (
                    <Warning color={color} style={style}/>
                );
            case 'time':
                return (
                    <Schedule color={color} style={style}/>
                );
            default:
                break;
        }
    }
    return (<div style={{width:size, height: size}}/>);
};


export const inputValidationAlwaysTrue = (toValidate) => {
    return true;
};

export const inputValidationSingleChoice = (toValidate) => {
    return toValidate != -1;
};

export const inputValidationNonEmpty = (toValidate) => {
    return toValidate && toValidate.replace(/ /g, '').length > 0;
};

export const inputValidationNonNull = (toValidate) => {
    return toValidate != null;
};

export const inputValidationEmail = (toValidate) => {
    return validator.isEmail(toValidate);
};

export const inputValidationPhone = (toValidate) => {
    return validator.isMobilePhone(toValidate, 'ro-RO');
};

export const inputValidationInteger = (toValidate) => {
    return validator.isInt(toValidate);
};

export const inputValidationYesSelected = (toValidate) => {
    return toValidate === 'yes';
};

export const inputValidationLengthNonZero = (toValidate) => {
    return toValidate.length > 0;
};

export const inputValidationSpecificTicketEquipments = (toValidate) => {
    return toValidate.length > 1 || inputValidationNonEmpty(toValidate[0].title);
};

export const inputValidationSpecificAllStockHasQuantity = (toValidate, quantity) => {
    for(let i=0; i<toValidate.length; ++i) {
        if(!quantity[toValidate[i]] || parseInt(quantity[toValidate[i]]) <= 0) {
            return false;
        }
    }
    return true;
};

export const inputValidationSpecificAllStockHasQuantityAndPrice = (toValidate, quantity, price) => {
    for(let i=0; i<toValidate.length; ++i) {
        if(!quantity[toValidate[i]] || parseInt(quantity[toValidate[i]]) <= 0 || !price[toValidate[i]] || parseInt(price[toValidate[i]]) <= 0) {
            return false;
        }
    }
    return true;
};

export const debounce = (func, wait, immediate) => {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


export const convertCSVtoJSON = (csv) => {
    
    var lines=csv.split("\n");
    
    var result = [];
    
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",");
    
    for(var i=1;i<lines.length;i++){
        
        var obj = {};
        var currentline=lines[i].split(",");
        
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        
        result.push(obj);
        
    }
    
    return result;
}