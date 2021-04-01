import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import './SettingsPage.scss';

import {snackAdd} from '../../store/action/application-store-actions';
import PageWrapper from '../../component/base/PageWrapper';
import InternalToolbar from '../../component/application/InternalToolbar';

class SettingsPage extends React.Component {
    
    state = {
    
    };
    
    render() {
        return (
            <PageWrapper pageClassName={'SettingsPage'}>
                <InternalToolbar/>
            </PageWrapper>
        );
    };
}

const mapStateToProps = (state) => {
    return {
    
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toast: (label, action) => dispatch(snackAdd(label, action)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SettingsPage));