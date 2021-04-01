import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BaseModal from '../model/BaseModal';
import Calendar from 'react-calendar';
import './DatePickerModal.scss';

class DatePickerModal extends Component {

    static propTypes = {
        open: PropTypes.bool,
        value: PropTypes.any,
        title: PropTypes.string,
        onClose: PropTypes.func,
        
        defaultView: PropTypes.string,
    };

    state = {
        color: '',
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if(!this.props.open && nextProps.open) {
            this.setState({
                color: nextProps.value,
            });
        }
    }
    
    render () {
        return (
            <BaseModal
                open={this.props.open}
                doneActive={this.inParameters}
        
                title={this.props.title}
        
                onClose={this.props.onClose}
                onDone={this.onDone}>
                
                
                
            </BaseModal>
        );
    }
    
    onDone = () => {
        this.props.onDone(this.state.color);
    }
    
    get inParameters() {
        return true;
    }
    
    onChange = (newValue) => {
        this.setState({
            date: newValue,
        });
    }
    
}

export default DatePickerModal;