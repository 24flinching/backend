'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Businesses', 'walletAddress', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Businesses', 'walletCurrency', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Businesses', 'walletAddress'),
      queryInterface.removeColumn('Businesses', 'walletCurrency'),
    ]);
  },
};
