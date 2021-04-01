import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import './PickerModal.scss';
import {snackAdd} from '../../../store/action/application-store-actions';
import PropTypes from 'prop-types';
import BaseModal from './BaseModal';
import {filter, renderIf} from '../../../support/min-support';
import StaticList from '../../application/StaticList';

class PickerModal extends Component {
    static propTypes = {
        open: PropTypes.bool,
        options: PropTypes.array,
        initialSelectedValues: PropTypes.array,

        title: PropTypes.string,

        search: PropTypes.bool,
        searchInDescription: PropTypes.bool,

        minimumChoices: PropTypes.number,
        maximumChoices: PropTypes.number,

        fetchOptions: PropTypes.func,

        onClose: PropTypes.func,
        onMore: PropTypes.func,
        onDone: PropTypes.func,

        onMoreText: PropTypes.string,

        children: PropTypes.array,
    };
    
    state = {
        options: [],
        numberOfSelected: 0,

        search: '',
    };
    
    componentWillReceiveProps(nextProps, nextContext) {
        if((!this.props.open && nextProps.open) || (this.props.options.length !== nextProps.options.length)) {
            this.update(nextProps);
        }
    }

    clear = () => {
        this.setState({
            search: '',
        });
    };
    
    update = (props) => {
        this.clear();
        if(props.fetchOptions) {
            props.fetchOptions((options) => {
                let [scanned, activeNb] = this.scan(options, props.initialSelectedValues);
                this.setState({
                    options: scanned,
                    numberOfSelected: activeNb,
                });
            });
        } else {
            let [scanned, activeNb] = this.scan(props.options, props.initialSelectedValues);
            this.setState({
                options: scanned,
                numberOfSelected: activeNb,
            });
        }
    };

    scan = (options, selectedValues) => {
        let nbActive = 0;
        for(let i = 0; i < options.length; ++i) {
            let found = false;
            for(let j = 0; j < selectedValues.length; ++j) {
                if(options[i].value === selectedValues[j]) {
                    found = true;
                    nbActive += 1;
                    break;
                }
            }
            options[i].active = found;
        }
        return [options, nbActive];
    };

    render () {
        return (
            <BaseModal
                open={this.props.open}
                hideDone={this.singleItemChoice}
                doneActive={this.inParameters}
                stableHeight={this.props.search}
                stableWidth={this.props.search}

                title={this.props.title}

                onMore={this.props.onMore}
                onMoreText={this.props.onMoreText}

                renderFixedElements={() => {
                    if(this.props.search) {
                        return (
                            <div className={'picker-modal-search-container'}>
                                <input className={'picker-modal-search-input'} placeholder={'Cauta'} onChange={(newValue) => {
                                    this.setState({
                                        search: newValue.target.value,
                                    });
                                }}/>
                            </div>
                        );
                    } else return null;
                }}

                onClose={this.props.onClose}
                onDone={this.onDone}>

                <div className={'PickerModal'}>
                    <div className={'picker-modal-list-container'}>
                        {
                            <StaticList items={this.filter(this.state.options)} renderItem={(item) => {
                                return (
                                    <ItemEntry
                                        key={item.value}
                                        value={item.value}
                                        label={item.label}
                                        description={item.description}
                                        active={item.active}
                                        disabled={!item.active && this.state.numberOfSelected >= this.props.maximumChoices && !(this.singleItemChoice)}
                                        onPress={this.onItemPress}/>
                                );
                            }}/>
                        }
                    </div>
                </div>

                {
                    this.props.children
                }

            </BaseModal>
        );
    }

    filter = (list) => {
        if(!this.props.search) {
            return list;
        }

        let fields = ['label'];
        if(this.props.searchInDescription) fields.push('description');

        return filter(list, fields, this.state.search);
    };

    get singleItemChoice () {
        return this.props.maximumChoices === 1 && this.props.minimumChoices === 1 && !this.props.needsConfirmation;
    }

    get inParameters () {
        return this.state.numberOfSelected >= this.props.minimumChoices && this.state.numberOfSelected <= this.props.maximumChoices;
    }

    onItemPress = (value, label) => {
        let options = this.state.options;

        if(this.singleItemChoice) {
            this.props.onDone([value]);
        }

        for(let i = 0; i < options.length; ++i) {
            if(options[i].value === value) {
                options[i].active = !options[i].active;
                if(options[i].active) {
                    this.setState({
                        numberOfSelected: this.state.numberOfSelected + 1,
                    });
                } else {
                    this.setState({
                        numberOfSelected: this.state.numberOfSelected - 1,
                    });
                }
                break;
            }
        }
        this.setState({
            options: options,
        });
    };

    onDone = () => {
        let selectedValues = [];
        for(let i = 0; i < this.state.options.length; ++i) {
            if(this.state.options[i].active) {
                selectedValues.push(this.state.options[i].value);
            }
        }

        if(this.props.maximumChoices === 1 && selectedValues.length === 0) {
            selectedValues.push(-1);
        }

        this.clear();
        this.props.onDone(selectedValues);
    };

}

const ItemEntry = (props) => {
    let insideStyle = {};
    let outsideStyle = {};
    if(!props.active) {
        insideStyle.backgroundColor = '#cccccc';
    }
    if(props.disabled) {
        outsideStyle.backgroundColor = '#888888';
        insideStyle.backgroundColor = '#888888';
    }
    return(
        <div className={'PickerModalItemEntry'} onClick={() => {
            if(!props.disabled) {
                props.onPress(props.value, props.label);
            }
        }}>
            <div className={'modal-checkbox-outline'} style={outsideStyle}>
                <div className={'modal-checkbox-inside'} style={insideStyle}/>
            </div>

            <div className={'modal-item-content'}>
                <div className={'modal-item-content-title'}>
                    {
                        props.label
                    }
                </div>
                {
                    renderIf(!!props.description,
                        <div className={'modal-item-content-description'}>
                            {
                                props.description
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

ItemEntry.propTypes = {
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    active: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,

    onPress: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        currentClient: state.application.currentClient,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toast: (label, action) => dispatch(snackAdd(label, action)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PickerModal));