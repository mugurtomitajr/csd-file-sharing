import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './Toast.scss';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {snackAdd, snackRemove} from '../../store/action/application-store-actions';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

export const kToastActionNormal = 1;
export const kToastActionError = 2;
export const kToastActionWarn = 3;

class Toast extends Component {
    
    static propTypes = {
        onSnackAdd: PropTypes.func,
        onSnackRemove: PropTypes.func,
        
        snack: PropTypes.array,
    };
    
    state = {
        snack: {},
    };
    
    componentWillReceiveProps(nextProps, nextContext) {
        this.checkForSnack(nextProps);
    }
    
    componentDidMount() {
        this.checkForSnack(this.props);
    }
    
    getClassName = (action) => {
        switch(action) {
            case kToastActionNormal:
                return 'snack-normal';
            case kToastActionError:
                return 'snack-error';
            case kToastActionWarn:
                return 'snack-warn';
        }
        return 'snack-normal';
    };
    
    render () {
        let className = 'snack-normal';
        if(this.state.snack.hasOwnProperty('action')) {
            className = this.getClassName(this.state.snack.action);
        }
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={ this.state.snack.hasOwnProperty('label') }
                className={'Toast'}>
    
                <SnackbarContent className={className} message={this.state.snack.label}/>
                
            </Snackbar>
        );
    }
    
    checkForSnack = (props) => {
        if(props.snack.length > 0) {
            if (!this.state.snack.hasOwnProperty('label')) {
                this.setState({
                    snack: props.snack[0],
                }, () => {
                    this.props.onSnackRemove();
                    setTimeout(() => {
                        this.setState({
                            snack: {},
                        }, () => {
                            setTimeout(() => {
                                this.checkForSnack(this.props);
                            }, 200);
                        });
                    }, 2000);
                });
            }
        }
    };
    
}

const mapStateToProps = (state) => {
    return {
        snack: state.application.snack,
        snackMonitor: state.application.snackMonitor,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSnackAdd: (message) => dispatch(snackAdd(message)),
        onSnackRemove: () => dispatch(snackRemove()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Toast));