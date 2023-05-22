// ACTIONS TYPES
export const ADD_USER_INFO = 'ADD_USER_INFO';

// ACTIONS CREATORS
export const addUserInfo = (email, name) => ({
  type: ADD_USER_INFO,
  payload: { email, name },
});
