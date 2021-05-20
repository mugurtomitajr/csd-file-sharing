import {updateObject} from '../../support/min-support';
import {
    kActionApplicationAddKey, kActionApplicationDeleteKey,
    kActionApplicationSetNameAndVersion, kActionApplicationSetNodeUid,
    kActionApplicationSnackAdd,
    kActionApplicationSnackRemove
} from '../action/application-store-actions';

const initialState = {
    
    appName: '',
    appVersion: '',
    
    snack: [],
    snackMonitor: 0,
    
    nodeUid: null,
    keys: [],
    
};

const reducer = (state = initialState, action) => {
    if(action.type === kActionApplicationSnackAdd) {
        return snackAdd(state, action.label, action.action);
    } else if(action.type === kActionApplicationSnackRemove) {
        return snackRemove(state);
    } else if(action.type === kActionApplicationSetNameAndVersion) {
        return setNameAndVersion(state, action.appName, action.appVersion);
    } else if(action.type === kActionApplicationSetNodeUid) {
        return setNodeUid(state, action.nodeUid);
    } else if(action.type === kActionApplicationAddKey) {
        return addKey(state, action.keyPath, action.groupUid);
    } else if(action.type === kActionApplicationDeleteKey) {
        return deleteKey(state, action.keyPath, action.groupUid);
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

const setNodeUid = (state, nodeUid) => {
    return updateObject(state, {
        nodeUid: nodeUid,
    });
}

const addKey = (state, keyPath, groupUid) => {
    return state;
}

const deleteKey = (state, keyPath, groupUid) => {
    return state;
}

export default reducer;