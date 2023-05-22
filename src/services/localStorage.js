export const setTokenOnStorage = (token) => {
  localStorage.setItem('token', token);
};

export const getTokenFromStorage = () => (localStorage.getItem('token'));
