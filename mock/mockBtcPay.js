// mock/mockBtcPay.js
function createCharge({ amount, currency }) {
  return {
    id: `mock_btc_charge_${Date.now()}`,
    provider: 'btcpay',
    amount,
    currency,
    status: 'new',
  };
}

module.exports = {
  createCharge,
};
