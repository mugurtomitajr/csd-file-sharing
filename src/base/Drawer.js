import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import './Drawer.scss';
import {kDrawerItemActive, kDrawerPages} from '../support/values';
import {snackAdd} from '../store/action/application-store-actions';

const Drawer = (props) => {
    const onItemPress = (item) => {
        console.log(props.history.path);
        if(props.history.path != '/' + item.id) {
            props.history.go(-props.history.index);
            props.history.replace('/' + item.id);
        }
    }
    
    let location = props.history.entries[0].pathname;
    let active = location.replace('/', '');
    
    return (
        <div className={'Drawer'}>
            
            <div className={'logo-container'}>
                <img className={'logo'} src={require('../assets/images/logo-medium.png')}/>
                <div className={'app-name'}>{props.appName}</div>
                <div className={'app-version'}>{'version ' + props.appVersion}</div>
            </div>
            
            {
                kDrawerPages.map((item) => {
                    return (
                        <DrawerItem key={item.id} item={item} onPress={onItemPress} active={active === item.id}/>
                    );
                })
            }
        </div>
    );
};

const DrawerItem = (props) => {
    let style = {};
    if (props.active) {
        style.backgroundColor = '#999999';
        style.color = '#282828';
    }
    return (
        <div className={'DrawerItem'} style={style} onClick={() => props.onPress(props.item)}>
            {props.item.name}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        appName: state.application.appName,
        appVersion: state.application.appVersion,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toast: (label, action) => dispatch(snackAdd(label, action)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Drawer));