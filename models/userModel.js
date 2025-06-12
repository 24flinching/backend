// models/userModel.js
const db = require('../db');

async function getUserByBusinessId(businessId) {
  return db('users').where({ business_id: businessId }).first();
}

module.exports = {
  getUserByBusinessId,
};
