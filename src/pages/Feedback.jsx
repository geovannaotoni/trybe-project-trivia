import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import Header from '../components/header';
import { setPlayerOnStorage } from '../services/localStorage';
import { addScore } from '../redux/actions';

class Feedback extends Component {
  savePlayerOnStorage = () => {
    const { name, score, email, history, dispatch } = this.props;
    const hash = md5(email).toString();
    setPlayerOnStorage({
      name,
      score,
      gravatarImg: hash,
    });
    dispatch(addScore(0, 0)); // resetar o jogo
    history.push('/ranking');
  };

  feedbackMessage() {
    const { assertions } = this.props;
    const hit = 3;

    if (assertions < hit) {
      return 'Could be better...';
    }
    return 'Well Done!';
  }

  render() {
    const { assertions, score } = this.props;
    return (
      <div>
        <Header />
        <p>Feedback</p>
        <p>Your Score</p>
        <span data-testid="feedback-total-score">{ score }</span>
        <p>Your Assertions</p>
        <span data-testid="feedback-total-question">{ assertions }</span>
        <div data-testid="feedback-text">{this.feedbackMessage()}</div>
        <Link to="/" data-testid="btn-play-again">
          <button type="button">Play Again</button>
        </Link>
        <button
          type="button"
          data-testid="btn-ranking"
          onClick={ this.savePlayerOnStorage }
        >
          Ranking
        </button>
      </div>
    );
  }
}

Feedback.propTypes = {
  assertions: PropTypes.number,
  score: PropTypes.number,
  email: PropTypes.string,
  name: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  dispatch: PropTypes.func,
}.isRequired;

const mapStateToProps = (globalState) => ({
  assertions: globalState.player.assertions,
  score: globalState.player.score,
  email: globalState.userReducer.email,
  name: globalState.userReducer.name,
});

export default connect(mapStateToProps)(Feedback);
