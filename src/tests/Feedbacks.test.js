import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import Feedback from '../pages/Feedback';
import { addScore } from '../redux/actions';
import App from '../App';

describe('Testes de funcionalidade na tela de Feedbacks', () => {
  it('Verifica se retorna a mensagem "Could be better..." quando os acertos são menores que 3', async () => {
    const initialState = {
      questions: [],
      assertions: 2,
      score: 0,
    }
    const { store } = renderWithRouterAndRedux(<Feedback />, { initialState });
    store.dispatch(addScore(0,initialState.assertions))
    const feedbackMessage = await screen.findByTestId('feedback-text');

    expect(feedbackMessage).toHaveTextContent('Could be better...');
  });

  it('Verifica se retorna a mensagem "Well Done!" quando os acertos são maiores ou igual a 3', async () => {
    const initialState = {
      questions: [],
      assertions: 5,
      score: 0,
    }
    const { store } = renderWithRouterAndRedux(<Feedback />, { initialState });
    store.dispatch(addScore(0,initialState.assertions))
    const feedbackMessage = await screen.findByTestId('feedback-text');

    expect(feedbackMessage).toHaveTextContent('Well Done!');
  });
});
