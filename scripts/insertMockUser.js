const db = require('../db');

async function insertMockUser() {
  try {
    const existing = await db('users').where({ business_id: 'mock_btc_shop' }).first();

    if (existing) {
      console.log('✅ Mock BTCPay user already exists:', existing);
    } else {
      await db('users').insert({
        business_id: 'mock_btc_shop',
        name: 'Mock BTC Shop',
        provider: 'btcpay',
      });
      console.log('✅ Mock BTCPay user inserted.');
    }

    process.exit();
  } catch (err) {
    console.error('❌ Error inserting mock user:', err);
    process.exit(1);
  }
}

insertMockUser();
