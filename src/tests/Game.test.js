import { render, screen, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockData from './helpers/mockData';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import Game from '../pages/Game';

describe('Testes para a tela de Jogo', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it('Verifica se a tela de Jogo renderiza a questão correta, as alternativas e o timer', async () => {
    renderWithRouterAndRedux(<Game />);
    await waitForElementToBeRemoved(() => screen.getByText('Carregando...'));
    const firstQuestion = mockData.results[0];
    const {
      category,
      question,
      correct_answer: correctAnswer, 
      incorrect_answers: incorrectAnswers 
    } = firstQuestion;
    expect(screen.getByTestId("question-category")).toHaveTextContent(category);
    expect(screen.getByTestId("question-text")).toHaveTextContent(question);
    expect(screen.getByTestId("correct-answer")).toHaveTextContent(correctAnswer);
    incorrectAnswers.forEach((answer) => {
      expect(screen.getByText(answer)).toBeInTheDocument();
    })
    expect(screen.getByText(/timer:/i)).toBeInTheDocument();
  });

  it('Verifica se ao clicar em alguma alternativa, os botões são desabilitados e o botão de Next é renderizado', async () => {
    renderWithRouterAndRedux(<Game />);
    expect(screen.queryByTestId("btn-next")).not.toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByText('Carregando...'));
    const correctBtn = screen.getByTestId("correct-answer");
    userEvent.click(correctBtn);
    expect(screen.getByTestId("btn-next")).toBeInTheDocument();
  });

  it('Verifica se, ao clicar em uma alternativa correta, o score é atualizado', async () => {
    renderWithRouterAndRedux(<Game />);
    expect(screen.queryByTestId("header-score")).toHaveTextContent(0)
    await waitForElementToBeRemoved(() => screen.getByText('Carregando...'));

    // teste para questão nível hard: score (10 + 30*3 = 100)
    const correctBtnOne = screen.getByTestId("correct-answer");
    userEvent.click(correctBtnOne);
    expect(screen.queryByTestId("header-score")).toHaveTextContent(100);

    userEvent.click(screen.getByTestId("btn-next"));
    expect(screen.getByTestId("question-text")).toHaveTextContent(mockData.results[1].question);

    // teste para questão medium: score 100 + (10 + 30*2 = 70) = 170
    const correctBtnTwo = screen.getByTestId("correct-answer");
    userEvent.click(correctBtnTwo);
    expect(screen.queryByTestId("header-score")).toHaveTextContent(170);

    userEvent.click(screen.getByTestId("btn-next"));
    expect(screen.getByTestId("question-text")).toHaveTextContent(mockData.results[2].question);

    // teste para questão easy: score 170 + (10 + 30*1 = 40) = 210
    const correctBtnThree = screen.getByTestId("correct-answer");
    userEvent.click(correctBtnThree);
    expect(screen.queryByTestId("header-score")).toHaveTextContent(210);
  });

  it('Verifica se o timer é atualizado', async () => {
    renderWithRouterAndRedux(<Game />);
    await waitForElementToBeRemoved(() => screen.getByText('Carregando...'));
    expect(screen.getByText(/timer: 30 seconds/i)).toBeInTheDocument();

    expect(await screen.findByText(/timer: 29 seconds/i)).toBeInTheDocument();
  });

  it('Verifica se, ao aguardar 30 segundos, os botões são desativados', async () => {
    renderWithRouterAndRedux(<Game />);
    await waitForElementToBeRemoved(() => screen.getByText('Carregando...'));
    expect(screen.getByText(/timer: 30 seconds/i)).toBeInTheDocument();

    const firstQuestion = mockData.results[0];
    const {
      incorrect_answers: incorrectAnswers 
    } = firstQuestion;

    setTimeout(() => {
      expect(screen.getByTestId("correct-answer")).toBeDisabled();
      incorrectAnswers.forEach((answer) => {
        expect(screen.getByText(answer)).toBeDisabled();
      })
      done();
    }, 30000)
  });

  it('Verifica se, caso a API retorne um código de erro, a página é redirecionada para a rota "/"', async () => {
    global.fetch.mockRestore();

    const mockDataInvalid = {
      "response_code": 3,
      "results": [],
    }

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockDataInvalid),
    });

    const { history } = renderWithRouterAndRedux(<App />);
    const nameInput = screen.getByTestId('input-player-name');
    const emailInput = screen.getByTestId('input-gravatar-email');
    const buttonPlay = screen.getByRole('button', { name: /play/i })

    userEvent.type(nameInput, 'Nome Teste');
    userEvent.type(emailInput, 'test@trybe.com');
    userEvent.click(buttonPlay);

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/game');
    });

    await waitForElementToBeRemoved(() => screen.queryByText('Carregando...'));
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });
});