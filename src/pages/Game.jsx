import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Header from '../components/header';
import { fetchApiQuestions } from '../services/fetchAPI';
import '../styles/Game.css';
import { addScore } from '../redux/actions';

const TIMER_INTERVAL = 1000; // Intervalo do timer em milissegundos

class Game extends Component {
  state = {
    questions: [],
    indexQuestion: 0,
    shuffledOptions: [],
    correctAnswer: '',
    btnClick: undefined,
    timer: 30,
    score: 0,
    assertions: 0,
    buttonsDisabled: false,
    nextVisible: true,
  };

  async componentDidMount() {
    await this.getQuestionsFromAPI();
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  getQuestionsFromAPI = async () => {
    const { history } = this.props;
    const { response_code: responseCode, results } = await fetchApiQuestions();
    const ERROR_CODE = 3;
    if (responseCode === ERROR_CODE) {
      history.push('/');
    }
    this.setState(
      {
        questions: results,
      },
      () => {
        this.setAnswersOnState();
      },
    );
  };

  setAnswersOnState = () => {
    const { questions, indexQuestion } = this.state;
    const question = questions[indexQuestion];
    const { correct_answer: correctAnswer,
      incorrect_answers: incorrectAnswers } = question;
    const allAnswers = [...incorrectAnswers, correctAnswer];
    const shuffledOptions = this.shuffleArray(allAnswers);
    this.setState({
      correctAnswer,
      shuffledOptions,
    });
  };

  shuffleArray = (array) => {
    const newArray = [...array];
    const randomSort = () => Math.random() - 1 / 2;
    const shuffledArray = newArray.sort(randomSort);
    return shuffledArray;
  };

  startTimer = () => {
    // Inicia o temporizador usando setInterval
    this.timerInterval = setInterval(() => {
      this.setState((prevState) => {
        // Verifica se o temporizador chegou a 1 segundo ou menos
        if (prevState.timer <= 1) {
          // Se o temporizador chegou a 1 segundo ou menos, para o temporizador e desabilita os botões
          this.stopTimer();
          return { buttonsDisabled: true };
        }
        // Atualiza o estado do componente, decrementando o valor do temporizador de 1 em 1 segundo
        return { timer: prevState.timer - 1 };
      });
    }, TIMER_INTERVAL); // Define o intervalo do temporizador em milissegundos
  };

  stopTimer = () => {
    // Para o temporizador usando clearInterval e passando o ID do intervalo
    clearInterval(this.timerInterval);
  };

  difficultyCheck = () => {
    // Define o valor da dificuldade da questão
    const { questions, indexQuestion } = this.state;
    const { difficulty } = questions[indexQuestion];

    const difficultyValue = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    let difficultyID = 0;
    switch (difficulty) {
    case 'easy':
      difficultyID = difficultyValue.easy;
      break;
    case 'medium':
      difficultyID = difficultyValue.medium;
      break;
    case 'hard':
      difficultyID = difficultyValue.hard;
      break;
    default:
      difficultyID = 0;
    }

    return difficultyID;
  };

  handleClick = (event) => {
    const { dispatch } = this.props;
    const { timer, correctAnswer } = this.state;
    const patternPoint = 10;
    const difficultyID = this.difficultyCheck();
    this.setState({
      btnClick: true,
      nextVisible: false,
    }, this.stopTimer);
    const asnwerCheck = event.target.innerHTML === correctAnswer;
    // Verifica se o botão clicado é diferente das respostas erradas. Caso seja, realiza a soma.
    if (asnwerCheck) {
      this.setState((prevState) => {
        const point = patternPoint + (timer * difficultyID);
        const newScore = prevState.score + point;
        const newPoint = prevState.assertions + 1;
        dispatch(addScore(newScore, newPoint));
        return {
          score: newScore,
          assertions: newPoint,
        };
      });
    }
  };

  nextQuestion = () => {
    const { indexQuestion } = this.state;
    const { history } = this.props;
    const questionsLength = 4;
    if (indexQuestion === questionsLength) {
      history.push('/feedbacks');
    } else {
      this.setState((prevState) => ({
        indexQuestion: prevState.indexQuestion + 1,
      }));
      this.setAnswersOnState();
      this.setState({
        nextVisible: true,
        buttonsDisabled: false,
        btnClick: undefined,
        timer: 30,
      });
      this.startTimer();
    }
  };

  render() {
    const { questions,
      indexQuestion,
      shuffledOptions,
      correctAnswer,
      btnClick,
      timer,
      buttonsDisabled,
      nextVisible } = this.state;

    if (questions.length === 0) {
      return (
        <div>
          <Header />
          <p>Carregando...</p>
        </div>
      );
    }

    const { category, question } = questions[indexQuestion];

    return (
      <div>
        <Header />
        <p data-testid="question-category">{category}</p>
        <p data-testid="question-text">{question}</p>
        <p>
          Timer:
          {' '}
          {timer}
          {' '}
          seconds
        </p>
        <div data-testid="answer-options">
          {shuffledOptions.map((option, index) => (
            <button
              key={ index }
              type="button"
              data-testid={ option
                === correctAnswer ? 'correct-answer' : `wrong-answer-${index}` }
              onClick={ this.handleClick }
              className={ btnClick && (option
                === correctAnswer ? 'correct' : 'incorrect') }
              disabled={ buttonsDisabled }
            >
              {option}
            </button>
          ))}
          { nextVisible ? (
            <div />
          ) : (
            <button
              value="Next"
              onClick={ this.nextQuestion }
              data-testid="btn-next"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Game);
