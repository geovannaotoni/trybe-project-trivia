import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MoveLeft, Star } from 'lucide-react';
import { getPlayersFromStorage } from '../services/localStorage';
import '../styles/Ranking.css';

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
    const { history } = this.props;
    return (
      <div data-testid="ranking-title" className="ranking-container">
        <h1>
          Ranking
        </h1>
        <section>
          {
            players.map((player, index) => (
              <article key={ index }>
                <div>
                  <img
                    src={ `https://www.gravatar.com/avatar/${player.gravatarImg}` }
                    alt={ player.gravatarImg }
                    data-testid="header-profile-picture"
                  />
                  <p data-testid={ `player-name-${index}` }>{player.name}</p>
                </div>
                <div>
                  <Star
                    size={ 36 }
                    color="#ffd700"
                    style={ { fill: '#ffd700', stroke: 'none' } }
                  />
                  <p data-testid={ `player-score-${index}` }>{player.score}</p>
                  <p>points</p>
                </div>
              </article>
            ))
          }
        </section>
        <button
          type="button"
          data-testid="btn-go-home"
          className="btn-go-home"
          onClick={ () => history.push('/') }
        >
          <MoveLeft />
          Back to Login
        </button>
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
