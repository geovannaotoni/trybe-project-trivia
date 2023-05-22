import React, { Component } from 'react';

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

  handleClickPlay = () => {

  };

  render() {
    const { name, email, btnDisabled } = this.state;
    return (
      <div>
        <input
          type="text"
          name="name"
          value={ name }
          placeholder="Digite seu nome"
          data-testid="input-player-name"
          onChange={ this.handleChange }
        />
        <input
          type="email"
          name="email"
          value={ email }
          placeholder="Digite seu e-mail"
          data-testid="input-gravatar-email"
          onChange={ this.handleChange }
        />
        <button
          type="button"
          data-testid="btn-play"
          onClick={ this.handleClickPlay }
          disabled={ btnDisabled }
        >
          Play
        </button>
      </div>
    );
  }
}

export default Login;
