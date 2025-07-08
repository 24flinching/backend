'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Businesses', [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        name: 'Coffee Shop',
        ownerId: '11111111-1111-1111-1111-111111111111',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        name: 'Book Store',
        ownerId: '22222222-2222-2222-2222-222222222222',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Businesses', null, {});
  },
};
