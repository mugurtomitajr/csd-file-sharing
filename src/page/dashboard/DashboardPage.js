import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import './DashboardPage.scss';

import {snackAdd} from '../../store/action/application-store-actions';
import PageWrapper from '../../component/base/PageWrapper';
import {EasyButton} from '../../component/button/Button';
import InternalToolbar, {
    Section as ToolbarSection,
    Text as ToolbarText
} from '../../component/application/InternalToolbar';
import {convertCSVtoJSON, prettyDate, renderIf} from '../../support/min-support';

import LoadingLottie from '../../component/application/LoadingLottie';

const electron = window.require('electron');

class DashboardPage extends React.Component {
    
    state = {
        loading: false,
    };
    
    componentDidMount() {
    
    }
    
    render() {
        return (
            <PageWrapper pageClassName={'DashboardPage'}>
                <InternalToolbar toolbarRight={this.toolbarRight}/>
                
                <div className={'DashboardPage'}>
                    
                    {
                        renderIf(this.state.loading,
                            <LoadingLottie/>
                        )
                    }
                    
                </div>
                
            </PageWrapper>
        );
    };
    
    toolbarRight = () => {
        return (
            <ToolbarSection>
                <ToolbarText text={'Dashboard Page'}/>
            </ToolbarSection>
        )
    }
    
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardPage));