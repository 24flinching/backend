// routes/api.js
const express = require('express');
const router = express.Router();
const { User, Business, Charge } = require('../models');
const authenticate = require('../middleware/authenticate');

// GET /api/dashboard
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const businesses = await Business.findAll({
      where: { userId },
      include: [{ model: Charge }],
    });

    res.json({ businesses });
  } catch (err) {
    console.error('❌ Error in dashboard route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
