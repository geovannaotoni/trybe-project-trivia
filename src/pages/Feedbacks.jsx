import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/header';

class Feedbacks extends Component {
  feedbackMessage() {
    const { assertions } = this.props;
    const hit = 3;

    if (assertions < hit) {
      return 'Could be better...';
    }
    return 'Well Done!';
  }

  render() {
    return (
      <div>
        <Header />
        <p>Feedback</p>
        <div data-testid="feedback-text">{this.feedbackMessage()}</div>
      </div>
    );
  }
}

Feedbacks.propTypes = {
  assertions: PropTypes.number,
}.isRequired;

const mapStateToProps = (globalState) => ({
  assertions: globalState.player.assertions,
});

export default connect(mapStateToProps)(Feedbacks);
