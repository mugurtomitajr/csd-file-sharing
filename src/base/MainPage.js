import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import { withRouter } from 'react-router-dom';

import './MainPage.scss';

import {snackAdd} from '../store/action/application-store-actions';
import Drawer from './Drawer';
import {kPageDashboard, kPageIndexSimulation, kPageSettings} from '../support/values';
import SettingsPage from '../page/settings/SettingsPage';
import DashboardPage from '../page/dashboard/DashboardPage';

class MainPage extends React.Component {
    
    state = {
    
    };
    
    componentDidMount() {
        this.props.toast("Welcome");
    
        this.props.history.replace('/' + kPageDashboard.id);
    }
    
    render() {
        return (
            <Route render={({location}) => (
                <div className={'MainPage'}>
            
                    <Drawer/>
                    
                    <TransitionGroup style={{flex:1, height: '100%'}}>
                
                        <CSSTransition
                            classNames={'page-transition'}
                            key={location.key}
                            timeout={300}
                            appear={true}
                            leave={true}>
                            <Switch location={location}>
    
                                <Route exact path={'/' + kPageDashboard.id} render={props => <DashboardPage/>}/>
                                <Route exact path={'/' + kPageSettings.id} render={props => <SettingsPage/>}/>
                            
                            </Switch>
                        </CSSTransition>
            
                    </TransitionGroup>
        
                </div>
            )}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainPage));