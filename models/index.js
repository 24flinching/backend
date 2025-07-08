const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
  // Production: use DATABASE_URL with SSL enabled
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // Development: connect with separate params and SSL disabled
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      dialectOptions: {
        ssl: false,
      },
      logging: false,
    }
  );
}

const db = {};

// Import models
db.User = require('./user')(sequelize, DataTypes);
db.Business = require('./business')(sequelize, DataTypes);
db.Charge = require('./charge')(sequelize, DataTypes);

// Call associate if exists
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
