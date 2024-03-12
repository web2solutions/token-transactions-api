import users from '@seed/users';

const employee = users[2];
const { username, password } = employee;
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
const requestHeaderEmployee3 = {
  Authorization: `Basic ${token}`
};

export default requestHeaderEmployee3;
