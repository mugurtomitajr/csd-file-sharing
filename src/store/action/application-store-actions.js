export const kActionApplicationSnackAdd = 'SNACKBAR_ADD';
export const kActionApplicationSnackRemove = 'SNACKBAR_REMOVE';

export const kActionApplicationSetNameAndVersion = 'APPLICATION_SET_NAME_AND_VERSION';

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
    }
}