import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './BaseModal.scss';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
import {IconButton} from '@material-ui/core';
import {renderIf} from '../../../support/min-support';

class BaseModal extends Component {
    
    static propTypes = {
        open: PropTypes.bool.isRequired,

        title: PropTypes.string,

        hideDone: PropTypes.bool,
        hideClose: PropTypes.bool,

        doneActive: PropTypes.bool,

        stableHeight: PropTypes.bool,
        stableWidth: PropTypes.bool,

        renderFixedElements: PropTypes.func,

        onClose: PropTypes.func.isRequired,
        onMore: PropTypes.func,
        onDone: PropTypes.func,

        onMoreText: PropTypes.string,

        children: PropTypes.array,
    };

    handleKeyboard = (e) => {
        if(e.keyCode === 13){ // enter
            if(!this.props.hideDone && this.readyToSend) {
                this.props.onDone();
            }
        }
    };

    get readyToSend () {
        if(this.props.hideDone) {
            return false;
        }
        return this.props.doneActive;
    }
    
    render () {
        let mainStyle = {};
        let doneStyle = {};
        if(this.props.stableHeight) {
            mainStyle.height = '90%';
        }
        if(this.props.stableWidth) {
            mainStyle.width = '90%';
        }
        if(!this.readyToSend) {
            doneStyle.backgroundColor ='#00000000';
            doneStyle.color ='#999999';
        }

        return (
            <Modal
                open={this.props.open}
                closeAfterTransition
                BackdropComponent={Backdrop}
                onClose={this.props.onClose}
                BackdropProps={{ timeout: 500 }}
                className={'BaseModal'}>
                <Fade in={this.props.open}>
                    <div className={'modal-container'} tabIndex={0} onKeyDown={this.handleKeyboard} style={mainStyle}>

                        <div className={'modal-top-container'}>
                            <div className={'modal-close-container'}>
                                {
                                    renderIf(!!this.props.title,
                                        <div className={'modal-title-text'}>
                                            {
                                                this.props.title
                                            }
                                        </div>
                                    )
                                }
                                {
                                    renderIf(!this.props.hideClose,
                                        <IconButton onClick={this.props.onClose} style={{padding: 8}} edge="start" color="inherit" aria-label="close">
                                            <CloseIcon color={'#999999'} style={{color: '#999999'}} width={30} height={30}/>
                                        </IconButton>
                                    )
                                }
                            </div>
                            {
                                !!this.props.renderFixedElements && this.props.renderFixedElements()
                            }
                        </div>

                        <div className={'modal-content-container'}>
                            {
                                this.props.children
                            }
                        </div>

                        <div className={'modal-button-container'}>
                            {
                                renderIf(this.props.onMore,
                                    <div onClick={this.props.onMore} className={'modal-button-more'}>
                                        {this.props.onMoreText}
                                    </div>
                                )
                            }

                            {
                                renderIf(!this.props.hideDone,
                                    <div onClick={this.onDone} style={doneStyle} className={'modal-button-done'}>
                                        {'Save'}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </Fade>
            </Modal>
        );
    }

    onDone = () => {
        if(this.readyToSend) {
            this.props.onDone();
        }
    }
}

export default BaseModal;