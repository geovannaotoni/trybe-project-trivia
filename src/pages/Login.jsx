import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Gamepad2 } from 'lucide-react';
import { fetchToken } from '../services/fetchAPI';
import { setTokenOnStorage } from '../services/localStorage';
import { addUserInfo } from '../redux/actions';
import '../styles/Login.css';

class Login extends Component {
  state = {
    name: '',
    email: '',
    btnDisabled: true,
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    }, () => {
      this.setState({
        btnDisabled: !this.verifyFields(),
      });
    });
  };

  verifyFields = () => {
    const { name, email } = this.state;
    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i; // https://pt.stackoverflow.com/questions/1386/express%C3%A3o-regular-para-valida%C3%A7%C3%A3o-de-e-mail
    const validationName = name.length > 0;
    const validationEmail = emailRegex.test(email);
    return validationName && validationEmail;
  };

  handleClickPlay = async () => {
    const { history, dispatch } = this.props;
    const { email, name } = this.state;
    const token = await fetchToken();
    setTokenOnStorage(token);
    dispatch(addUserInfo(email, name));
    history.push('/game');
  };

  handleClickSettings = () => {
    const { history } = this.props;
    history.push('/settings');
  };

  render() {
    const { name, email, btnDisabled } = this.state;
    return (
      <div className="login-container">
        <section className="title-animation">
          <Gamepad2 size={ 48 } />
          <p>Trivia Game</p>
        </section>
        <input
          type="text"
          name="name"
          value={ name }
          placeholder="Your Name"
          data-testid="input-player-name"
          onChange={ this.handleChange }
        />
        <input
          type="email"
          name="email"
          value={ email }
          placeholder="Your E-mail"
          data-testid="input-gravatar-email"
          onChange={ this.handleChange }
        />
        <button
          type="button"
          data-testid="btn-play"
          onClick={ this.handleClickPlay }
          disabled={ btnDisabled }
          className="btn-play"
        >
          Play
        </button>
        <button
          type="button"
          data-testid="btn-settings"
          onClick={ this.handleClickSettings }
          className="btn-settings"
        >
          Settings
        </button>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  dispatch: PropTypes.func,
}.isRequired;

export default connect()(Login);
