import {updateObject} from '../../support/min-support';
import {
    kActionApplicationSetNameAndVersion,
    kActionApplicationSnackAdd,
    kActionApplicationSnackRemove
} from '../action/application-store-actions';

const initialState = {
    
    appName: '',
    appVersion: '',
    
    snack: [],
    snackMonitor: 0,
    
    keys: [],
    
};

const reducer = (state = initialState, action) => {
    if(action.type === kActionApplicationSnackAdd) {
        return snackAdd(state, action.label, action.action);
    } else if(action.type === kActionApplicationSnackRemove) {
        return snackRemove(state);
    } else if(action.type === kActionApplicationSetNameAndVersion) {
        return setNameAndVersion(state, action.appName, action.appVersion);
    } else {
        return state;
    }
};


const snackAdd = (state, label, action) => {
    let snack = state.snack;
    snack.push({label: label, action: action});
    return updateObject(state, {
        snack: snack,
        snackMonitor: state.snackMonitor + 1,
    });
};

const snackRemove = (state) => {
    let snack = state.snack;
    snack.shift();
    return updateObject(state, {
        snack: snack,
    });
};

const setNameAndVersion = (state, appName, appVersion) => {
    return updateObject(state, {
        appName: appName,
        appVersion: appVersion,
    });
}

export default reducer;