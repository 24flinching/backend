const axios = require('axios');
const config = require('../config/config');

const BTCPAY_HOST = config.btcpay.host;       // e.g. https://btcpay.example.com
const BTCPAY_API_KEY = config.btcpay.apiKey;  // API key for authentication

/**
 * Create a BTCPay Server charge
 * @param {Object} params
 * @param {number|string} params.amount
 * @param {string} params.currency
 * @returns {Promise<Object>} charge data
 */
async function createCharge({ amount, currency }) {
  try {
    if (!BTCPAY_HOST || !BTCPAY_API_KEY) {
      throw new Error('BTCPay host or API key not configured');
    }

    // Construct the API endpoint URL
    const url = `${BTCPAY_HOST}/api/v1/invoices`;

    // Prepare the payload per BTCPay Server API spec
    const payload = {
      amount: amount.toString(),
      currency,
      // You can add optional fields here, like 'metadata', 'orderId', 'expirationTime', etc.
    };

    // Make POST request to create invoice/charge
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${BTCPAY_API_KEY}`,
      },
      timeout: 10000, // 10 seconds timeout
    });

    // BTCPay Server returns invoice data inside response.data
    const invoice = response.data;

    // Normalize response to match what your app expects
    return {
      id: invoice.id,
      status: invoice.status,
      hosted_url: invoice.url,
      btcAddress: invoice.address, // Sometimes invoice might include address (check BTCPay docs)
      amount,
      currency,
    };

  } catch (error) {
    console.error(`[${new Date().toISOString()}] BTCPay createCharge error:`, error.response?.data || error.message);
    throw new Error('BTCPay charge creation failed');
  }
}

module.exports = {
  createCharge,
};
