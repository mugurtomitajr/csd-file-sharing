import React from 'react';
import './Field.scss';
import {ArrowBackIosRounded} from '@material-ui/icons';

export const EasyField = (props) => {
    let style = {};
    
    if(props.disabled) {
        style.backgroundColor = '#242424';
        style.color = '#101010';
    }
    
    if(props.style) {
        style = {...style, ...props.style}
    }
    
    let content = props.text;
    
    if(!props.editable && (!content || content.length <= 0)) {
        content = '- - -';
    }
    
    let onPress = props.onPress;
    if(!onPress) {
        onPress = () => {};
    }
    
    if (!props.disabled && props.editable) {
        return (
            <input className={'EasyFieldEditable'} placeholder={props.placeholder} style={style} value={content} onChange={(event) => {props.onChange(event.target.value)}}/>
        );
    }
    
    return (
        <div className={'EasyField'} onClick={onPress} style={style}>
            {content}
        </div>
    );
}