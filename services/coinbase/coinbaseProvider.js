// providers/coinbaseProvider.js
const axios = require('axios');
const config = require('../config/config');

const API_KEY = config.coinbase.apiKey;
const BASE_URL = 'https://api.commerce.coinbase.com';

async function createCharge({ amount, currency }) {
  try {
    const response = await axios.post(
      `${BASE_URL}/charges`,
      {
        name: 'Payment',
        description: `Charge for ${amount} ${currency}`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: amount.toString(),
          currency,
        },
      },
      {
        headers: {
          'X-CC-Api-Key': API_KEY,
          'X-CC-Version': '2018-03-22',
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data; // The charge data

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Coinbase createCharge error:`, error.response?.data || error.message);
    throw new Error('Coinbase charge creation failed');
  }
}

module.exports = {
  createCharge,
};
