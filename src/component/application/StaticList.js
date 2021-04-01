import React, {Component} from 'react';
import './StaticList.scss';
import PropTypes from 'prop-types';
import LoadingComponent from './LoadingLottie';

class StaticList extends Component {

    static baseIncrement = 42; // 21
    static loadOffset = 100;

    static propTypes = {
        items: PropTypes.array.isRequired,
        renderItem: PropTypes.func.isRequired,

        loading: PropTypes.bool,
    };

    state = {
        maxElement: StaticList.baseIncrement,
    };

    lastSize = 0;

    componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.items && this.props.items.length != nextProps.items.length) {
            this.setState({
                maxElement: StaticList.baseIncrement,
            });
            this.lastSize = 0;
        }
    }

    handleScroll = (e) => {
        let bottom = e.target.scrollHeight - e.target.scrollTop < StaticList.loadOffset + e.target.clientHeight;
        if(bottom && this.state.maxElement > this.lastSize) {
            this.lastSize = this.state.maxElement;
            this.addToList();
        }
    };

    addToList = () => {
        this.setState({
            maxElement: this.state.maxElement + StaticList.baseIncrement,
        });
    };
    
    render () {

        if(this.props.loading) {
            return (
                <div className={'StaticList'}>
                    <LoadingComponent />
                </div>
            );
        }

        let items = [];
        if(this.props.items) {
            items = this.props.items;
        }

        return (
            <div className={'StaticList'} onScroll={this.handleScroll}>
                {
                    (items.slice(0, this.state.maxElement)).map((item) => {
                        return (
                            this.props.renderItem(item)
                        );
                    })
                }
            </div>
        );
    }
    
}

export default StaticList;