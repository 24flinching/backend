// controllers/authController.js
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Business } = require('../models');
const config = require('../config/config'); // Load config including jwtSecret

exports.register = async (req, res) => {
  try {
    console.log('📩 Register endpoint hit with body:', req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      id: uuidv4(),
      email,
      password: hashedPassword,
    });

    // Create default business for the new user
    const business = await Business.create({
      id: uuidv4(),
      userId: newUser.id,
      name: `${email.split('@')[0]}'s Business`,
    });

    // Sign JWT token
    const token = jwt.sign(
      { id: newUser.id },
      config.jwtSecret || 'secret',
      { expiresIn: '1h' }
    );

    console.log('✅ Registration successful:', newUser.id);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: newUser.id,
      businessId: business.id,
    });
  } catch (err) {
    console.error('🔴 Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('📩 Login endpoint hit with body:', req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.log('❌ Missing login credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    // Check user existence and password correctness
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('❌ Invalid credentials for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: user.id },
      config.jwtSecret || 'secret',
      { expiresIn: '1h' }
    );

    console.log('✅ Login successful:', user.id);
    res.json({ token, userId: user.id });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};
