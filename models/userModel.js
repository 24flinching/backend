// models/userModel.js

let users = [];

function addUser(user) {
  users.push(user);
  return user;
}

function getUserByEmail(email) {
  return users.find(u => u.email === email);
}

function getUserByBusinessId(businessId) {
  return users.find(u => u.businessId === businessId);
}

module.exports = {
  addUser,
  getUserByEmail,
  getUserByBusinessId,
};
