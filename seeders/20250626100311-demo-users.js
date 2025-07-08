'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'user1@example.com',
        passwordHash: '$2b$10$eB2ZkA7lDwFZQiLnb.xE8eXtaRlGnLEnAJYXzX1nlfNSm/SQdlkOy', // password123
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'user2@example.com',
        passwordHash: '$2b$10$eB2ZkA7lDwFZQiLnb.xE8eXtaRlGnLEnAJYXzX1nlfNSm/SQdlkOy', // password123
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
