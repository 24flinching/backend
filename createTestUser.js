const bcrypt = require('bcrypt');
const { User } = require('./models');  // Adjust path if needed

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('testpass', 10);
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
    });
    console.log('User created:', user.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createTestUser();
