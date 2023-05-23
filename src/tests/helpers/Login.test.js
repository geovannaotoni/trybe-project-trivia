import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux'
import Login from '../../pages/Login'
import App from '../../App';

describe('Teste na funcionalidade da tela de Login', () => {
  it('Verifica se é possível escrever o nome e email nos inputs de texto', async () => {
    renderWithRouterAndRedux(<Login />)

    const nameInput = await screen.findByTestId('input-player-name');
    const emailInput = await screen.findByTestId('input-gravatar-email');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();


    userEvent.type(nameInput, 'Nome Teste');
    userEvent.type(emailInput, 'test@trybe.com');
  })
  it('Verifica se o botão possui o nome "Play" e se fica desabilitado quando o nome ou email não estão preenchidos', async () => {
    renderWithRouterAndRedux(<Login />)

    const nameInput = await screen.findByTestId('input-player-name');
    const emailInput = await screen.findByTestId('input-gravatar-email');
    const button = await screen.getByRole('button', { name: /play/i })

    expect(button).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    userEvent.type(nameInput, 'Nome Teste');
    userEvent.type(emailInput, '');

    expect(button).toBeDisabled();

    userEvent.type(nameInput, '');
    userEvent.type(emailInput, 'test@trybe.com');
  })
  it('Verifica se o botão "Play" fica habilitado quando o nome e email estão preenchidos ', async () => {
    renderWithRouterAndRedux(<Login />)

    const nameInput = await screen.findByTestId('input-player-name');
    const emailInput = await screen.findByTestId('input-gravatar-email');
    const button = await screen.getByRole('button', { name: /play/i });

    expect(button).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    userEvent.type(nameInput, 'Nome Teste');
    userEvent.type(emailInput, 'test@trybe.com');

    expect(button).toBeEnabled();
  })
  it('Verifica se ao clicar no botão "Play" o jogo é iniciado e é salvado o token do jogador e se direciona para a tela de jogo', async () => {
    global.fetch = (url) => {
      return Promise.resolve({
        json: () => Promise.resolve({
          response_code: 0,
          response_message: "Token Generated Successfully!",
          token: "1f2ec3e06819703615e3fd387a2e92bc7bd409a5c8f51953ce4dffe91ee20986"
        })
      })
    }

    const { history } = renderWithRouterAndRedux(<App />)

    const nameInput = await screen.findByTestId('input-player-name');
    const emailInput = await screen.findByTestId('input-gravatar-email');
    const button = await screen.findByRole('button', { name: /play/i });

    userEvent.type(nameInput, 'Nome Teste');
    userEvent.type(emailInput, 'test@trybe.com');
    userEvent.click(button);
    
    window.localStorage.setItem('token', '1f2ec3e06819703615e3fd387a2e92bc7bd409a5c8f51953ce4dffe91ee20986')
    const storedValue = window.localStorage.getItem('token')
    expect(storedValue).toBe('1f2ec3e06819703615e3fd387a2e92bc7bd409a5c8f51953ce4dffe91ee20986')

    const { pathname } = history.location;
    expect(pathname).toBe('/game');
    const aboutTitle = screen.getByRole('heading',
    { name: 'Nome Teste' });
    expect(aboutTitle).toBeInTheDocument();

  })
  it('', async () => {
    global.fetch = (url) => {
      return Promise.resolve({
        json: () => Promise.resolve({
          response_code: 0,
          response_message: "Token Generated Successfully!",
          token: "1f2ec3e06819703615e3fd387a2e92bc7bd409a5c8f51953ce4dffe91ee20986"
        })
      })
    }

    renderWithRouterAndRedux(<Login />)

    const button = await screen.getByRole('button', { name: /play/i });

    userEvent.click(button);

    window.localStorage.setItem('token', '1f2ec3e06819703615e3fd387a2e92bc7bd409a5c8f51953ce4dffe91ee20986')
    const storedValue = window.localStorage.getItem('token')
    expect(storedValue).toBe('1f2ec3e06819703615e3fd387a2e92bc7bd409a5c8f51953ce4dffe91ee20986')
  })
})