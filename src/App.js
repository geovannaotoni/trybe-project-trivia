import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Game from './pages/Game';
import Settings from './pages/Settings';
import Feedbacks from './pages/Feedback';
import Ranking from './pages/Ranking';

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route exact path="/game" component={ Game } />
        <Route exact path="/settings" component={ Settings } />
        <Route exact path="/feedbacks" component={ Feedbacks } />
        <Route exact path="/ranking" component={ Ranking } />
      </Switch>
    </div>
  );
}
