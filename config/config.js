require('dotenv').config();

const port = process.env.PORT || 3001;

module.exports = {
  port,

  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false,
    },
    logging: false,
  },

  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },

  jwtSecret: process.env.JWT_SECRET || 'secret',

  // Coinbase Commerce API key
  coinbase: {
    apiKey: process.env.COINBASE_API_KEY || '',
  },

  // BTCPay Server config
  btcpay: {
    host: process.env.BTCPAY_HOST,
    apiKey: process.env.BTCPAY_API_KEY,
    storeId: process.env.BTCPAY_STORE_ID,
  },
};
