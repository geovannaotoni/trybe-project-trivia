// ACTIONS TYPES
export const ADD_USER_INFO = 'ADD_USER_INFO';
export const ADD_SCORE = 'ADD_SCORE';

// ACTIONS CREATORS
export const addUserInfo = (email, name) => ({
  type: ADD_USER_INFO,
  payload: { email, name },
});

export const addScore = (score) => ({
  type: ADD_SCORE,
  payload: score,
});
