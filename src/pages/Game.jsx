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
    nextQuestion: 0,
    timer: 30,
    score: 0,
    next: true,
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
          this.disableButtons();
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

  disableButtons = () => {
    // Obtem todos os botões cujo atributo data-testid começa com "correct-answer"
    const buttons = document.querySelectorAll('button[data-testid^="correct-answer"]');
    // Itera sobre cada botão desabilitando e definindo a propriedade disabled como true
    buttons.forEach((button) => {
      button.disabled = true;
    });
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
    const { timer, questions, indexQuestion } = this.state;
    const patternPoint = 10;
    const incorrect = questions[indexQuestion].incorrect_answers;
    const difficultyID = this.difficultyCheck();
    this.setState({
      btnClick: true,
      next: false,
    }, this.stopTimer);
    const asnwerCheck = incorrect.some((wrongAnswer) => (
      event.target.innerHTML !== wrongAnswer));
    // Verifica se o botão clicado é diferente das respostas erradas. Caso seja, realiza a soma.
    if (asnwerCheck) {
      this.setState((prevState) => {
        const point = patternPoint + (timer + difficultyID);
        const newScore = prevState.score + point;
        dispatch(addScore(newScore));
        return {
          score: newScore,
        };
      });
    }
  };

  nextQuestion = () => {
    const { questions, nextQuestion } = this.state;
    if (nextQuestion < questions.length - 1) {
      this.setState((prevState) => ({
        nextQuestion: prevState.nextQuestion + 1,
      }));
    }
    this.setAnswersOnState();
    this.setState({
      next: true,
    });
  };

  render() {
    const { questions,
      indexQuestion,
      shuffledOptions,
      correctAnswer,
      btnClick,
      timer,
      next } = this.state;

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
              disabled={ timer === 0 }
            >
              {option}
            </button>
          ))}
          { next ? (
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
