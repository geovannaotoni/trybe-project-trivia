import { getTokenFromStorage } from './localStorage';

export const fetchToken = async () => {
  const url = 'https://opentdb.com/api_token.php?command=request';
  const response = await fetch(url);
  const data = await response.json();
  return data.token;
};

export const fetchApiQuestions = async () => {
  const token = getTokenFromStorage();
  const request = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
  const data = await request.json();
  return data;
};
