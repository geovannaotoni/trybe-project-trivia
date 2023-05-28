import { ADD_SCORE } from '../actions';

const INITIAL_STATE = {
  assertions: 0,
  score: 0,
};

const playerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case ADD_SCORE:
    return {
      ...state,
      ...action.payload,

    };
  default:
    return state;
  }
};

export default playerReducer;
