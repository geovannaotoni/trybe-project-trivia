import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Header from '../components/header';
import { fetchApiQuestions } from '../services/fetchAPI';
import '../styles/Game.css';

const TIMER_INTERVAL = 1000; // Intervalo do timer em milissegundos

class Game extends Component {
  state = {
    questions: [],
    indexQuestion: 0,
    shuffledOptions: [],
    correctAnswer: '',
    btnClick: undefined,
    timer: 30,
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

  handleClick = () => {
    this.setState({
      btnClick: true,
    });
  };

  render() {
    const { questions,
      indexQuestion,
      shuffledOptions,
      correctAnswer,
      btnClick,
      timer } = this.state;

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
