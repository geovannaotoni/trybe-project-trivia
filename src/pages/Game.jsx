import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Header from '../components/header';
import { fetchApiQuestions } from '../services/fetchAPI';

class Game extends Component {
  state = {
    questions: [],
    indexQuestion: 0,
    shuffledOptions: [],
    correctAnswer: '',
  };

  async componentDidMount() {
    await this.getQuestionsFromAPI();
  }

  getQuestionsFromAPI = async () => {
    const { history } = this.props;
    const { response_code: responseCode, results } = await fetchApiQuestions();
    const ERROR_CODE = 3;
    if (responseCode === ERROR_CODE) {
      history.push('/');
    }
    this.setState({
      questions: results,
    }, () => {
      this.setAnswersOnState();
    });
  };

  setAnswersOnState = () => {
    const { questions, indexQuestion } = this.state;
    const question = questions[indexQuestion];
    const {
      correct_answer: correctAnswer,
      incorrect_answers: incorrectAnswers,
    } = question;
    const allAnswers = [...incorrectAnswers, correctAnswer];
    const shuffledOptions = this.shuffleArray(allAnswers);
    console.log(allAnswers);
    this.setState({
      correctAnswer,
      shuffledOptions,
    });
  };

  shuffleArray = (array) => {
    // após sugestão do Prof João
    const newArray = [...array];
    const randomSort = () => Math.random() - 1 / 2;
    const shuffledArray = newArray.sort(randomSort);
    return shuffledArray;
  };

  render() {
    const { questions } = this.state;
    if (questions.length === 0) {
      return (
        <div>
          <Header />
          <p>Carregando...</p>
        </div>
      );
    }
    const { indexQuestion, shuffledOptions, correctAnswer } = this.state;
    const { category, question } = questions[indexQuestion];
    return (
      <div>
        <Header />
        <p data-testid="question-category">{category}</p>
        <p data-testid="question-text">{question}</p>
        <div data-testid="answer-options">
          {shuffledOptions.map((option, index) => (
            <button
              key={ index }
              type="button"
              data-testid={
                option === correctAnswer ? 'correct-answer' : `wrong-answer-${index}`
              }
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Game);
