import users from '@seed/users';

const employee = users[0];
const { username, password } = employee;
let token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");
const requestHeaderEmployee1 = { 
  'Authorization': `Basic ${token}`
};

export default requestHeaderEmployee1;