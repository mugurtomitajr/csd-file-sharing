import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {kPages} from '../../support/values';

import './InternalToolbar.scss';
import {BackButton} from '../button/Button';

class InternalToolbar extends React.Component {
    
    static propTypes = {
        left: PropTypes.func,
        center: PropTypes.func,
        right: PropTypes.func,
    };
    
    render() {
        let location = this.props.history.location.pathname;
        let currentPage = location.replace('/', '');
        let pageName = '';
        let foundPage = kPages.filter((item) => item.id === currentPage);
        if (foundPage.length > 0) pageName = foundPage[0].name;
        let hasBack = this.props.history.canGo(-1);
        
        return (
            <div className={'InternalToolbar'}>
                <div className={'internal-toolbar-inner'}>
                    {this.left(pageName, hasBack)}
                    {this.center(pageName)}
                    {this.right()}
                </div>
            </div>
        );
    }
    
    left = (pageName, hasBack) => {
        if(this.props.left){
            return this.props.left(pageName, hasBack);
        }
        return (
            <Section>
                <BackButton disabled={!hasBack} onPress={this.onBack}/>
                <PageTitle pageName={pageName}/>
            </Section>
        );
    }
    
    center = (pageName) => {
        if(this.props.center){
            return this.props.center(pageName);
        }
        return null;
    }
    
    right = (pageName) => {
        if(this.props.right){
            return this.props.right(pageName);
        }
        return (
            <Section>
            
            </Section>
        );
    }
    
    onBack = () => {
        this.props.history.goBack();
    }
}

export const Section = (props) => {
    return (
        <div className={'InternalToolbarSection'}>
            {props.children}
        </div>
    );
}

export const PageTitle = (props) => {
    return (
        <div className={'InternalToolbarTitle'}>
            {
                props.pageName.toUpperCase()
            }
        </div>
    );
}

export const Text = (props) => {
    return (
        <div className={'InternalToolbarText'}>
            {
                props.text
            }
        </div>
    );
}

export default withRouter(InternalToolbar);