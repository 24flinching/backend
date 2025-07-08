const axios = require('axios');
const config = require('../config/config');

const BTCPAY_HOST = config.btcpay.host;
const BTCPAY_API_KEY = config.btcpay.apiKey;
const BTCPAY_STORE_ID = config.btcpay.storeId;

async function createCharge({ amount, currency }) {
  try {
    if (!BTCPAY_HOST || !BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
      throw new Error('BTCPay host, store ID, or API key not configured');
    }

    const url = `${BTCPAY_HOST}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`;

    const payload = {
      amount: amount.toString(),
      currency,
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${BTCPAY_API_KEY}`,
      },
      timeout: 10000,
    });

    const invoice = response.data;

    return {
      id: invoice.id,
      status: invoice.status,
      hosted_url: invoice.checkoutLink || invoice.url,
      btcAddress: invoice.address,
      amount,
      currency,
    };
  } catch (error) {
    const errorData = error.response?.data;
    console.error(`[${new Date().toISOString()}] ❌ BTCPay createCharge error`, {
      url: `${BTCPAY_HOST}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`,
      payload: { amount: amount.toString(), currency },
      status: error.response?.status,
      response: errorData,
      message: error.message,
    });
    throw new Error(errorData?.message || 'BTCPay charge creation failed');
  }
}

async function getChargeStatus(chargeId) {
  try {
    if (!BTCPAY_HOST || !BTCPAY_API_KEY || !chargeId) {
      throw new Error('Missing BTCPay config or charge ID');
    }

    const url = `${BTCPAY_HOST}/api/v1/invoices/${chargeId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${BTCPAY_API_KEY}`,
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    console.error(`[${new Date().toISOString()}] ❌ BTCPay getChargeStatus error`, {
      url: `${BTCPAY_HOST}/api/v1/invoices/${chargeId}`,
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
