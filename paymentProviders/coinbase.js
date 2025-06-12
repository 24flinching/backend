// paymentProviders/coinbase.js
const coinbase = require('coinbase-commerce-node');
const { Charge } = coinbase.resources;

function createCoinbaseCharge(user, amount, currency) {
  const apiKey = process.env.COINBASE_API_KEY;

  if (!apiKey) {
    throw new Error('Coinbase API key not set in environment variables.');
  }

  // Init inside function so it's not run on import
  const Client = require('coinbase-commerce-node').Client;
  Client.init(apiKey);

  const chargeData = {
    name: `Payment to ${user.name}`,
    description: 'Payment through Coinbase',
    local_price: {
      amount: amount.toString(),
      currency: currency,
    },
    pricing_type: 'fixed_price',
    metadata: {
      business_id: user.business_id,
    },
  };

  return Charge.create(chargeData);
}

module.exports = {
  createCoinbaseCharge,
};
