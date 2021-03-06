// @flow

import React, { PropTypes } from 'react';
import ListBody from '../listBody/ListBody.jsx';
import _ from 'lodash';
import './List.css';

type Props = {
  pins: Array<Object>
}

class List extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.clientHeight = window.innerHeight;
    // this would be the ideal scenario to make it more modular, but I want to force a three column render
    // this.pinsPerPage = Math.floor(this.clientHeight / this.props.pinHeight);
    this.pinsPerPage = 6;

    this.state = {
      visibleStart: 0,
      visibleEnd: this.pinsPerPage,
      displayStart: 0,
      displayEnd: this.pinsPerPage * 4
    };

    // throttling to avoid too many calls onScroll
    (this:any).scrollState = _.throttle(this.scrollState.bind(this), 100);
    (this:any).handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  scrollState(scrollTop) {
    // visibleStart/End denote the indexes of the pins that are visible to the user
    const visibleStart = Math.floor(scrollTop / this.props.pinHeight);
    const visibleEnd = visibleStart + this.pinsPerPage;

    // displayStart/End denote the indexes of the pins rendered which include a buffer in additon to the immedietly visible
    const displayStart = Math.max(0, visibleStart - this.pinsPerPage);
    const displayEnd = displayStart + (4 * this.pinsPerPage);

    const newState = {
      visibleStart: visibleStart,
      visibleEnd: visibleEnd,
      displayStart: displayStart,
      displayEnd: displayEnd,
    };

    // makes sure I'm deleting and adding 3 elements at a time to avoid reordering by flexbox
    if (Math.abs(visibleStart - this.state.visibleStart) >= 3 && visibleStart % 3 === 0) {
      this.setState(newState);
    }
  }

  handleScrollEvent(e: Object) {
    // necesary to persist the synthetic event inorder to throttle
    e.persist();
    this.scrollState(e.target.scrollTop);
  }

  render() {
    return (
      <div>
        <div onScroll={this.handleScrollEvent} className="List" style={{height: this.clientHeight}}>
          <ListBody
            pins={this.props.pins}
            visibleStart={this.state.visibleStart}
            visibleEnd={this.state.visibleEnd}
            displayStart={this.state.displayStart}
            displayEnd={this.state.displayEnd}
            pinHeight={this.props.pinHeight}
            />
        </div>
      </div>
    )
  }
}

List.propTypes = {
  pins: PropTypes.array.isRequired
};

export default List;
