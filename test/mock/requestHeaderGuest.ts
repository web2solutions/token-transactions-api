const employee = {
  username: 'guest',
  password: 'guest',
  permissions: []
};
const { username, password } = employee;
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
const requestHeaderGuest = {
  Authorization: `Basic ${token}`
};

export default requestHeaderGuest;
