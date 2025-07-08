const db = require('../db');

async function saveCharge(charge) {
  return db('charges').insert(charge);
}

async function getChargesByBusinessId(businessId) {
  return db('charges').where({ business_id: businessId }).orderBy('created_at', 'desc');
}

module.exports = {
  saveCharge,
  getChargesByBusinessId,
};
