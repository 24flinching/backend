// routes/chargeRoutes.js
const express = require('express');
const router = express.Router();
const { Charge, Business } = require('../models');
const chargeController = require('../controllers/chargeController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all charge routes
router.use(authMiddleware);

// === Create a New Charge ===
router.post('/', chargeController.createCharge);

// === Get Charges for a Business Owned by the User ===
router.get('/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const business = await Business.findOne({ where: { id: businessId, userId } });
    if (!business) {
      return res.status(403).json({ error: 'Access denied — you do not own this business' });
    }

    const charges = await Charge.findAll({ where: { businessId } });
    res.json({ charges });
  } catch (error) {
    console.error('Error fetching charges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
