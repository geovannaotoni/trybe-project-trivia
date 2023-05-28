import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPlayersFromStorage } from '../services/localStorage';

class Ranking extends Component {
  state = {
    players: [],
  };

  componentDidMount() {
    const playersList = getPlayersFromStorage();
    const playersOrderedList = playersList.sort((a, b) => b.score - a.score);

    this.setState({
      players: playersOrderedList,
    });
  }

  render() {
    const { players } = this.state;
    return (
      <div data-testid="ranking-title">
        Ranking
        <section>
          {
            players.map((player, index) => (
              <article key={ index }>
                <img
                  src={ `https://www.gravatar.com/avatar/${player.gravatarImg}` }
                  alt={ player.gravatarImg }
                  data-testid="header-profile-picture"
                />
                <p data-testid={ `player-name-${index}` }>{player.name}</p>
                <p data-testid={ `player-score-${index}` }>{player.score}</p>
              </article>
            ))
          }
        </section>

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

Ranking.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string,
  score: PropTypes.number,
}.isRequired;

const mapStateToProps = (globalState) => ({
  email: globalState.userReducer.email,
  name: globalState.userReducer.name,
  score: globalState.player.score,
});

export default connect(mapStateToProps)(Ranking);
