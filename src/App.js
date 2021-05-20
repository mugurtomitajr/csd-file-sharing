import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import './App.scss';
import {connect} from 'react-redux';
import LoadingLottie from './component/application/LoadingLottie';
import Toast from './component/base/Toast';
import MainPage from './base/MainPage'

import { channels, isProduction } from './shared/constants';
import {setNameAndVersion, setNodeUid, snackAdd} from './store/action/application-store-actions';
import {getNodeUid} from './store/persistent/persistent';
const { ipcRenderer } = window;

class App extends React.Component {
    
    state = {
        loading: true,
    };
    
    constructor(props) {
        super(props);
    
        ipcRenderer.send(channels.APP_INFO);
        ipcRenderer.on(channels.APP_INFO, (event, arg) => {
            ipcRenderer.removeAllListeners(channels.APP_INFO);
            const { appName, appVersion } = arg;
            this.props.setAppNameAndVersion(appName, appVersion);
        });
    }
    
    componentDidMount() {
        let waitTime = isProduction ? 1000 : 0;
        setTimeout(async () => {
            let nodeUid = await getNodeUid();
            this.props.setNodeUid(nodeUid);
            this.setState({
                loading: false,
            });
        }, waitTime);
    };
    
    render() {
        if (this.state.loading) {
            return (
                <div className={'App'}>
                    <LoadingLottie appName={this.state.appName} appVersion={this.state.appVersion} />
                </div>
            );
        }
        
        return (
            <div className="App">
                <MemoryRouter>
                
                    <Toast/>
                    
                    <MainPage/>
                
                </MemoryRouter>
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        appName: state.application.appName,
        appVersion: state.application.appVersion,
        nodeUid: state.application.nodeUid,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toast: (label, action) => dispatch(snackAdd(label, action)),
        setAppNameAndVersion: (appName, appVersion) => dispatch(setNameAndVersion(appName, appVersion)),
        setNodeUid: (nodeUid) => dispatch(setNodeUid(nodeUid)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
