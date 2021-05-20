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

import {selfInterfaces, connectToServer} from '../../shared/network-manager';
import {EasyField} from '../../component/button/Field';
import {kToastActionError, kToastActionWarn} from '../../component/base/Toast';

const electron = window.require('electron');

const kStage = {
    disconnected: 'disconnected',
    connected: 'connected',
};

class DashboardPage extends React.Component {
    
    state = {
        loading: false,
        
        username: '',
        stage: kStage.disconnected,
        connection: null,
        
        destination: '',
        message: '',
        
        destinationFile: '',
        filename: '',
        
        logs: [],
        logText: '',
    };
    
    componentDidMount() {
        console.log('self interfaces', selfInterfaces());
        console.log('node-uid', this.props.nodeUid);
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
    
                    <EasyField text={"Bine ai venit,"}/>
                    
                    {renderIf(this.state.stage === kStage.disconnected,
                        this.disconnectedUI()
                    )}
    
                    {renderIf(this.state.stage === kStage.connected,
                        this.connectedUI()
                    )}
                    
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
    
    disconnectedUI = () => {
        return (
            <>
                <EasyField text={"Pentru a putea trimite mesaje in retea este necesar sa te conectezi la server cu un nume de utilizator."}/>
                <EasyField text={"Numele ales nu are importanta, dar va trebui introdus de catre ceilalti utilizatori care vor dori sa iti trimita tie un mesaj."}/>
                
                <EasyField
                    editable
                    text={this.state.username}
                    onChange={(newValue) => {this.setState({username: newValue})}}
                    placeholder={'nume utilizator'}
                    style={{marginTop: 4, marginBottom: 8, minWidth: 400}}/>
    
                <EasyButton text={'Conecteaza-te'} onPress={() => {
                    let connection = connectToServer(this.state.username, (sender, message) => {
                        this.props.toast("Ai primit un nou mesaj de la " + sender + ".");
                        let logs = this.state.logs;
                        logs.push({
                            sender: sender,
                            destination: this.state.username,
                            message: message,
                        });
                        this.setState({
                            logs: logs,
                        });
                    }, (sender, filename) => {
                        this.props.toast("Ai primit un nou fisier de la " + sender + ".");
                        let logs = this.state.logs;
                        logs.push({
                            sender: sender,
                            destination: this.state.username,
                            message: 'Fisier primit ' + filename,
                        });
                        this.setState({
                            logs: logs,
                        });
                    });
                    if(connection.successful) {
                        this.props.toast("Conectare efectuata cu succes!", kToastActionWarn);
                        this.setState({
                            stage: kStage.connected,
                            connection: connection,
                        });
                    } else {
                        this.props.toast("Conectare esuata!", kToastActionError);
                        this.setState({
                            stage: kStage.disconnected,
                            connection: null,
                        });
                    }
                    
                }}/>
            </>
        )
    }
    
    connectedUI = () => {
        return (
            <>
                <EasyField text={"Esti conectat la server cu numele de utilizator: " + this.state.username}/>
    
                {this.consoleUI()}
                
                {this.sendMessageUI()}
                
                {this.sendFileUI()}
    
                <EasyField style={{marginTop: 24}} text={"Daca vrei sa te reconectezi cu alt nume sau vrei sa te deconectezi, apasa butonul de mai jos."}/>
                
                <EasyButton text={'Deconecteaza-te'} onPress={() => {
                    this.props.toast("Deconectare efectuata cu succes!");
                    this.setState({
                        username: '',
                        stage: kStage.disconnected,
                        destination: '',
                        message: '',
                        logs: [],
                    });
                }}/>
            </>
        )
    }
    
    consoleUI = () => {
        return (
            <>
                <textarea readOnly={true} className={'ConsoleTextarea'} value={
                    this.state.logs.reduce((acc, entry) => {
                        return (entry.sender + ' -> ' + entry.destination + ': ' + entry.message + '\n') + acc;
                    }, '')}/>
            </>
        )
    }
    
    sendMessageUI = () => {
        return (
            <>
                <EasyField style={{marginTop:24}} text={"Trimite un mesaj"}/>
    
                <EasyField
                    editable
                    text={this.state.destination}
                    onChange={(newValue) => {this.setState({destination: newValue})}}
                    placeholder={'destinatarul'}
                    style={{marginTop: 4, marginBottom: 4, minWidth: 400}}/>
    
                <EasyField
                    editable
                    text={this.state.message}
                    onChange={(newValue) => {this.setState({message: newValue})}}
                    placeholder={'mesajul'}
                    style={{marginTop: 4, marginBottom: 8, minWidth: 400}}/>
                
                <EasyButton text={'Trimite mesajul'} onPress={() => {
                    this.state.connection.sendMessage(this.state.destination, this.state.message);
                    this.props.toast("Mesajul a fost trimis cu succes!");
                    let logs = this.state.logs;
                    logs.push({
                        sender: this.state.username,
                        destination: this.state.destination,
                        message: this.state.message,
                    });
                    this.setState({
                        message: '',
                        logs: logs,
                    });
                }}/>
            </>
        )
    }
    
    sendFileUI = () => {
        return (
            <>
                <EasyField style={{marginTop:24}} text={"Trimite un fisier"}/>
                
                <EasyField
                    editable
                    text={this.state.destinationFile}
                    onChange={(newValue) => {this.setState({destinationFile: newValue})}}
                    placeholder={'destinatarul'}
                    style={{marginTop: 4, marginBottom: 4, minWidth: 400}}/>
                
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <EasyField
                        text={this.state.filename}
                        onChange={(newValue) => {this.setState({filename: newValue})}}
                        placeholder={'fisierul'}
                        style={{marginTop: 4, marginBottom: 8}}/>
                        
                    <EasyButton text={'Alege fisierul'} style={{marginBottom: 4, marginLeft: 8}} onPress={async () => {
                        let selectionResult = await electron.remote.dialog.showOpenDialog({ properties: ['openFile']});
                        if(!selectionResult.canceled) {
                            let filepath = selectionResult.filePaths[0];
                            this.setState({
                                filename: filepath,
                            });
                            this.props.toast("Fisierul a fost selectat cu succes.");
                        } else {
                            this.props.toast("Selectia a fost abandonata!", kToastActionError);
                        }
                    }}/>
                </div>
                
                <EasyButton text={'Trimite fisierul'} onPress={() => {
                    this.state.connection.sendFile(this.state.destinationFile, this.state.filename, (successful) => {
                        if(!successful) {
                            this.props.toast("Fisierul nu a fost trimis!", kToastActionError);
                            return;
                        }
                        this.props.toast("Fisierul a fost trimis cu succes!");
                        let logs = this.state.logs;
                        logs.push({
                            sender: this.state.username,
                            destination: this.state.destinationFile,
                            message: "Ai trimis un fisier...",
                        });
                        this.setState({
                            filename: '',
                            logs: logs,
                        });
                    });
                }}/>
            </>
        )
    }
    
}

const mapStateToProps = (state) => {
    return {
        nodeUid: state.application.nodeUid,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toast: (label, action) => dispatch(snackAdd(label, action)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardPage));