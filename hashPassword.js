// hashPassword.js
const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    console.log('Hashed password:', hash);
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}

// Change 'password123' to whatever password you want to hash
hashPassword('password123');
