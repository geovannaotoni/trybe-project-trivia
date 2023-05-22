import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';

class Header extends Component {
  state = {
    score: 0,
  };

  render() {
    const { score } = this.state;
    const { email, name } = this.props;
    const hash = md5(email).toString();
    return (
      <div>
        <img src={`https://www.gravatar.com/avatar/${hash}`} alt={ email } data-testid='header-profile-picture' />
        <h1 data-testid='header-player-name'>{name}</h1>
        <h2 data-testid='header-score'>{ score }</h2>
      </div>
    );
  }
}

Header.propTypes = { 
  name: PropTypes.string,
}.isRequired;

const mapStateToProps = (globalState) => ({
  email: globalState.userReducer.email,
  name: globalState.userReducer.name,
});

export default connect(mapStateToProps)(Header);