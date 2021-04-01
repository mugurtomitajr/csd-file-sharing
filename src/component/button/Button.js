import React from 'react';
import './Button.scss';
import {ArrowBackIosRounded} from '@material-ui/icons';

export const EasyButton = (props) => {
    let style = {};
    
    if(props.disabled) {
        style.backgroundColor = '#242424';
        style.color = '#101010';
    }
    
    if(props.style) {
        style = {...style, ...props.style}
    }
    
    let content = props.text;
    
    if(!content || content.length <= 0) {
        content = '- - -';
    }
    
    let onPress = props.onPress;
    if(!onPress) {
        onPress = () => {};
    }
    
    return (
        <div className={'EasyButton'} onClick={onPress} style={style}>
            {content}
        </div>
    );
}

export const BackButton = (props) => {
    if(props.disabled) {
        return null;
        return (
            <div className={'EasyButton'} onClick={props.onPress} style={{height: 27, width: 27, backgroundColor: '#00000000', cursor: 'default'}}>
            </div>
        )
    } else {
        return (
            <div className={'EasyButton'} onClick={props.onPress} style={{height: 27, width: 27, fontSize: 12, padding: 0}}>
                <ArrowBackIosRounded color={'#cccccc'} style={{fontSize: 27, padding: 4}}/>
            </div>
        )
    }
}