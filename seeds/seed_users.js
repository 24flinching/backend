exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      business_id: 'taco_shop',
      name: 'Taco Shop',
      provider: 'coinbase',
      api_key: process.env.COINBASE_API_KEY || null,
      btcpay_url: null,
      btcpay_token: null,
      btcpay_store_id: null,
    },
    {
      business_id: 'burger_joint',
      name: 'Burger Joint',
      provider: 'btcpay',
      api_key: null,
      btcpay_url: process.env.BTCPAY_URL || null,
      btcpay_token: process.env.BTCPAY_API_TOKEN || null,
      btcpay_store_id: process.env.BTCPAY_STORE_ID || null,
    },
  ]);
};
