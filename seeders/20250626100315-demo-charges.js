'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // Replace these business IDs with actual IDs from your Businesses table or use known UUIDs
    const businessId1 = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const businessId2 = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

    await queryInterface.bulkInsert('Charges', [
      {
        id: uuidv4(),
        businessId: businessId1,
        amount: 19.99,
        currency: 'USD',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        businessId: businessId2,
        amount: 45.00,
        currency: 'USD',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Charges', null, {});
  },
};
