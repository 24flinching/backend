exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('business_id').unique().notNullable();
    table.string('name').notNullable();
    table.string('provider').notNullable();
    table.string('api_key'); // Coinbase
    table.string('btcpay_url'); // BTCPay
    table.string('btcpay_token'); // BTCPay
    table.string('btcpay_store_id'); // BTCPay
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
