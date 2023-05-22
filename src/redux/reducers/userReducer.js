import { ADD_USER_INFO } from '../actions/index';

const INITIAL_STATE = {
  email: '',
  name: '',
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case ADD_USER_INFO:
    return { ...state, ...action.payload };
  default:
    return state;
  }
};

export default userReducer;
