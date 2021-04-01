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
        
        minDate: PropTypes.any,
        maxDate: PropTypes.any,
        
        defaultView: PropTypes.string,
    };

    state = {
        date: new Date(),
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if(!this.props.open && nextProps.open) {
            this.setState({
                date: nextProps.value,
            });
        }
    }
    
    render () {
        let defaultView = this.props.defaultView ? this.props.defaultView : 'year';
        return (
            <BaseModal
                open={this.props.open}
                doneActive={this.inParameters}
        
                title={this.props.title}
        
                onClose={this.props.onClose}
                onDone={this.onDone}>
                
                <Calendar
                    defaultView={defaultView}
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate}
                    value={this.state.date}
                    onChange={this.onChange} />
                
            </BaseModal>
        );
    }
    
    onDone = () => {
        this.props.onDone(this.state.date);
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