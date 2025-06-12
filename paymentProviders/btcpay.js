// paymentProviders/btcpay.js
function createBTCPayCharge(user, amount, currency) {
  // Simulate a fake BTCPay charge response
  return Promise.resolve({
    id: 'mock_btcpay_charge_123',
    hosted_url: 'https://btcpayserver.example.com/invoice?id=mock123',
    status: 'new',
    amount,
    currency,
    business_id: user.business_id,
    provider: 'btcpay',
  });
}

module.exports = {
  createBTCPayCharge,
};
