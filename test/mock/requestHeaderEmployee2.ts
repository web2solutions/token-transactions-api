import users from '@seed/users';

const employee = users[1];
const { username, password } = employee;
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
const requestHeaderEmployee2 = {
  Authorization: `Basic ${token}`
};

export default requestHeaderEmployee2;
