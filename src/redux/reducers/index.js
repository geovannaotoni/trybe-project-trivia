import { combineReducers } from 'redux';
import userReducer from './userReducer';
import playerReducer from './playerReducer';

const rootReducer = combineReducers({ userReducer, player: playerReducer });

export default rootReducer;
