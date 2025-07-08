// routes/businessRoutes.js
const express = require('express');
const router = express.Router();
const { Business } = require('../models');
const businessController = require('../controllers/businessController');
const authenticate = require('../middleware/authenticate');

// === Test Route ===
router.get('/test', (req, res) => {
  res.json({ message: 'Business test route is working!' });
});

// === Create Business ===
router.post('/', authenticate, (req, res, next) => {
  console.log('📨 POST /api/businesses hit');
  next();
}, businessController.createBusiness);

// === Get All Businesses for User ===
router.get('/', authenticate, businessController.getBusinesses);

// === Update Wallet Info ===
router.put('/:businessId/wallet', authenticate, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { btc, coinbase } = req.body;
    const userId = req.user.id;

    const business = await Business.findOne({ where: { id: businessId, userId } });
    if (!business) return res.status(404).json({ error: 'Business not found or not owned by user' });

    // Ensure wallets object exists
    if (!business.wallets) {
      business.wallets = {};
    }

    if (btc !== undefined) business.wallets.btc = btc;
    if (coinbase !== undefined) business.wallets.coinbase = coinbase;

    await business.save();
    res.json({ message: 'Wallets updated successfully', business });
  } catch (error) {
    console.error('Error updating wallets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === Update Business Info ===
router.put('/:businessId', authenticate, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const business = await Business.findOne({ where: { id: businessId, userId } });
    if (!business) return res.status(404).json({ error: 'Business not found or not owned by user' });

    if (name !== undefined) business.name = name;

    await business.save();
    res.json({ message: 'Business updated successfully', business });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === Delete Business ===
router.delete('/:businessId', authenticate, async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.user.id;

    const business = await Business.findOne({ where: { id: businessId, userId } });
    if (!business) return res.status(404).json({ error: 'Business not found or not owned by user' });

    await business.destroy();
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

console.log('✅ businessRoutes.js mounted');
module.exports = router;
