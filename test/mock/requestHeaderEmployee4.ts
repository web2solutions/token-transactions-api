import users from '@seed/users';

const employee = users[3];
const { username, password } = employee;
let token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");
const requestHeaderEmployee4 = { 
  'Authorization': `Basic ${token}`
};

export default requestHeaderEmployee4;