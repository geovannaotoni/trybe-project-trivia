import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import '../styles/Header.css';
import { Star } from 'lucide-react';

class Header extends Component {
  render() {
    const { email, name, score } = this.props;
    const hash = md5(email).toString();
    return (
      <header>
        <div>
          <img
            src={ `https://www.gravatar.com/avatar/${hash}` }
            alt={ email }
            data-testid="header-profile-picture"
          />
          <h1 data-testid="header-player-name">{ name }</h1>
        </div>
        <div>
          <Star
            size={ 36 }
            color="#ffd700"
            style={ { fill: '#ffd700', stroke: 'none' } }
          />
          <h2>Score:</h2>
          <h2 data-testid="header-score">{ score }</h2>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  name: PropTypes.string,
  score: PropTypes.number,
}.isRequired;

const mapStateToProps = (globalState) => ({
  email: globalState.userReducer.email,
  name: globalState.userReducer.name,
  score: globalState.player.score,
});

export default connect(mapStateToProps)(Header);
