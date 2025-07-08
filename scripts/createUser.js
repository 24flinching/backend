const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { User } = require('../models');

async function createUser() {
  await sequelize.sync(); // Ensure tables exist
  const hashedPassword = await bcrypt.hash('test123', 10);
  const user = await User.create({
    email: 'test@example.com',
    password: hashedPassword
  });
  console.log('✅ User created:', user.email);
  process.exit();
}

createUser();
