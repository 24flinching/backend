const axios = require('axios');

/**
 * Create a BTCPay invoice (charge) dynamically for any BTCPay store.
 * 
 * @param {Object} params
 * @param {string} params.host - BTCPay Server host URL, e.g. https://btcpay.example.com
 * @param {string} params.apiKey - BTCPay API key/token for the store
 * @param {string} params.storeId - BTCPay store ID
 * @param {number|string} params.amount - Amount to charge
 * @param {string} params.currency - Currency code, e.g. 'BTC', 'USD'
 * @returns {Promise<Object>} Invoice data including id, status, hosted_url, btcAddress, amount, currency
 */
async function createCharge({ host, apiKey, storeId, amount, currency }) {
  if (!host || !apiKey || !storeId) {
    throw new Error('Missing BTCPay config (host, apiKey, storeId)');
  }

  const url = `${host.replace(/\/$/, '')}/api/v1/stores/${storeId}/invoices`;

  const payload = {
    amount: amount.toString(),
    currency,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${apiKey}`,
      },
      timeout: 10000,
    });

    const invoice = response.data;

    return {
      id: invoice.id,
      status: invoice.status,
      hosted_url: invoice.checkoutLink || invoice.url,
      btcAddress: invoice.address || invoice.bitcoinAddress || null,
      amount,
      currency,
    };
  } catch (error) {
    const errorData = error.response?.data;
    console.error(`[${new Date().toISOString()}] ❌ BTCPay createCharge error`, {
      url,
      payload,
      status: error.response?.status,
      response: errorData,
      message: error.message,
    });
    throw new Error(errorData?.message || 'BTCPay charge creation failed');
  }
}

/**
 * Fetch the status of a BTCPay invoice (charge).
 * 
 * @param {Object} params
 * @param {string} params.host - BTCPay Server host URL
 * @param {string} params.apiKey - BTCPay API key/token for the store
 * @param {string} params.chargeId - BTCPay invoice ID
 * @returns {Promise<Object>} Invoice status data
 */
async function getChargeStatus({ host, apiKey, chargeId }) {
  if (!host || !apiKey || !chargeId) {
    throw new Error('Missing BTCPay config (host, apiKey) or chargeId');
  }

  const url = `${host.replace(/\/$/, '')}/api/v1/invoices/${chargeId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${apiKey}`,
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    console.error(`[${new Date().toISOString()}] ❌ BTCPay getChargeStatus error`, {
      url,
      status: error.response?.status,
      response: errorData,
      message: error.message,
    });
    throw new Error(errorData?.message || 'Failed to fetch charge status from BTCPay');
  }
}

module.exports = {
  createCharge,
  getChargeStatus,
};