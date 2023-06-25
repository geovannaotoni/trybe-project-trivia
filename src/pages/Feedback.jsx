import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import { CheckCircle, Star } from 'lucide-react';
import Header from '../components/header';
import { setPlayerOnStorage } from '../services/localStorage';
import { addScore } from '../redux/actions';
import '../styles/Feedback.css';

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
    const { assertions, score, history } = this.props;
    return (
      <>
        <Header />
        <section className="feedback-container">
          <h3>Feedback</h3>
          <div>
            <article>
              <Star />
              <p>Your Score:</p>
              <span data-testid="feedback-total-score">{ score }</span>
            </article>
            <article>
              <CheckCircle />
              <p>Your Assertions:</p>
              <span data-testid="feedback-total-question">{ assertions }</span>
            </article>
          </div>
          <div
            data-testid="feedback-text"
            className="feedback-text"
          >
            {this.feedbackMessage()}
          </div>
          <img src="https://blog.megajogos.com.br/wp-content/uploads/2019/01/think-about-it-meme-e1552409270257.jpg" alt="" />
        </section>
        <div className="button-container">
          <button
            type="button"
            data-testid="btn-play-again"
            onClick={ () => history.push('/') }
          >
            Play Again
          </button>
          <button
            type="button"
            data-testid="btn-ranking"
            onClick={ this.savePlayerOnStorage }
          >
            Ranking
          </button>
        </div>
      </>
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
