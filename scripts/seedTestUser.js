// scripts/seedTestUser.js
const bcrypt = require('bcrypt');
const { sequelize, User } = require('../models');

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const [user, created] = await User.findOrCreate({
      where: { email: 'test@example.com' },
      defaults: {
        password: hashedPassword,
      },
    });

    if (created) {
      console.log('✅ Test user created:', user.toJSON());
    } else {
      console.log('ℹ️ Test user already exists:', user.email);
    }
  } catch (err) {
    console.error('❌ Failed to create test user:', err);
  } finally {
    await sequelize.close();
  }
}

createTestUser();
