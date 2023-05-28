export const setTokenOnStorage = (token) => {
  localStorage.setItem('token', token);
};

export const getTokenFromStorage = () => (localStorage.getItem('token'));

export const getPlayersFromStorage = () => JSON.parse(localStorage.getItem('players'));

export const setPlayerOnStorage = (player) => {
  const players = getPlayersFromStorage() || [];
  localStorage.setItem('players', JSON.stringify([...players, player]));
};
