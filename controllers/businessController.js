// controllers/businessController.js
const { v4: uuidv4 } = require('uuid');
const { Business } = require('../models');

// === Create Business ===
exports.createBusiness = async (req, res) => {
  try {
    const { name, wallets } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    console.log('📨 Creating business with:', { name, wallets });

    const business = await Business.create({
      id: uuidv4(),
      name,
      userId,
      wallets: {
        btc: wallets?.btc || null,
        coinbase: wallets?.coinbase || null,
      },
    });

    res.status(201).json({ message: 'Business created', business });
  } catch (error) {
    console.error('❌ Error creating business:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// === Get All Businesses for User ===
exports.getBusinesses = async (req, res) => {
  try {
    const userId = req.user.id;
    const businesses = await Business.findAll({ where: { userId } });
    res.json({ businesses });
  } catch (error) {
    console.error('❌ Error fetching businesses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
