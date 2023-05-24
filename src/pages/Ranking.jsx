import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Ranking extends Component {
  render() {
    return (
      <div data-testid="ranking-title">
        Ranking
        <Link to="/">
          <button
            type="button"
            data-testid="btn-go-home"
          >
            Voltar para a tela de login

          </button>
        </Link>
      </div>
    );
  }
}

export default Ranking;
