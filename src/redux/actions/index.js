// ACTIONS TYPES
export const ADD_USER_INFO = 'ADD_USER_INFO';

// ACTIONS CREATORS
export const addUserInfo = (userInfo) => ({
  type: ADD_USER_INFO,
  payload: userInfo,
});
