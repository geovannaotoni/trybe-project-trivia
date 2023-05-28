import { screen, waitFor } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import Feedback from '../pages/Feedback';
import { addScore } from '../redux/actions';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testes de funcionalidade na tela de Feedbacks', () => {
  it('Verifica se retorna a mensagem "Could be better..." quando os acertos são menores que 3', async () => {
    const initialState = {
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
      assertions: 5,
      score: 0,
    }
    const { store } = renderWithRouterAndRedux(<Feedback />, { initialState });
    store.dispatch(addScore(0,initialState.assertions))
    const feedbackMessage = await screen.findByTestId('feedback-text');

    expect(feedbackMessage).toHaveTextContent('Well Done!');
  });

  it('Verifica se, ao clicar no botão Ranking, a pessoa usuária é redirecionada para a rota "/ranking" e os dados do jogo (score e assertions) são resetados', async () => {
    const initialState = {
      player: {
        assertions: 1,
        score: 80,
      }
    }
    const route = '/feedbacks';

    const { history } = renderWithRouterAndRedux(<App />, initialState, route );

    const rankingBtn = screen.getByRole('button', { name: /ranking/i })
    userEvent.click(rankingBtn);

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/ranking');
    });
    
  })
});
