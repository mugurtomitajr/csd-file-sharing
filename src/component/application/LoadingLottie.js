import React, { Component } from 'react';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types';
import loadingAnimation from '../../assets/lotties/animation-loading-v2';

class LoadingLottie extends Component {
    
    static propTypes = {
        appName: PropTypes.string,
        appVersion: PropTypes.string,
    }
    
    render () {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: loadingAnimation,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        
        if(this.props.appName && this.props.appVersion) {
            return (
                <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Lottie options={defaultOptions} height={200} width={200} style={{paddingBottom: 20}}/>
                    <div className={'AppNameText'}>{this.props.appName}</div>
                    <div className={'AppVersionText'}>{'version ' + this.props.appVersion}</div>
                </div>
            );
        }
        
        return (
            <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Lottie options={defaultOptions} height={200} width={200}/>
            </div>
        );
    }
    
}

export default LoadingLottie;