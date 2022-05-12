import axios from "axios";

const routes = {
  login: '/api/v1/login',
  fetch: '/api/v1/data',
};

const getAuthHeader = (token) => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

export default async () => {
  const {data} = await axios.get(routes.fetch, { headers: getAuthHeader() });
  console.log(data);
};