import {node} from 'prop-types';

export const kActionApplicationSnackAdd = 'SNACKBAR_ADD';
export const kActionApplicationSnackRemove = 'SNACKBAR_REMOVE';

export const kActionApplicationSetNameAndVersion = 'APPLICATION_SET_NAME_AND_VERSION';
export const kActionApplicationSetNodeUid = 'APPLICATION_SET_NODE_UID';

export const kActionApplicationAddKey = 'APPLICATION_ADD_KEY';
export const kActionApplicationDeleteKey = 'APPLICATION_DELETE_KEY';

export const snackAdd = (message, action) => {
    return {
        type: kActionApplicationSnackAdd,
        label: message,
        action: action,
    };
};

export const snackRemove = () => {
    return {
        type: kActionApplicationSnackRemove,
    };
};

export const setNameAndVersion = (appName, appVersion) => {
    return {
        type: kActionApplicationSetNameAndVersion,
        appName: appName,
        appVersion: appVersion,
    };
}

export const setNodeUid = (nodeUid) => {
    return {
        type: kActionApplicationSetNodeUid,
        nodeUid: nodeUid,
    };
}

export const addKey = (keyPath, groupUid) => {
    return {
        type: kActionApplicationAddKey,
        keyPath: keyPath,
        groupUid: groupUid,
    };
}

export const deleteKey = (keyPath, groupUid) => {
    return {
        type: kActionApplicationDeleteKey,
        keyPath: keyPath,
        groupUid: groupUid,
    };
}