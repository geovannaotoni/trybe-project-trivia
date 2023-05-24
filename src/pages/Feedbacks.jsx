import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/header';

class Feedbacks extends Component {
  render() {
    return (
      <div>
        <Header />
        <p data-testid="feedback-text">Feedback</p>
      </div>
    );
  }
}

export default connect()(Feedbacks);
