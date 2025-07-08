const express = require('express');
const router = express.Router();
const { Business, Charge } = require('../models');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const businesses = await Business.findAll({
      where: { userId },
      include: [{
        model: Charge,
        as: 'charges', // 👈 must match the alias in business.js
      }],
    });

    res.json({ businesses });
  } catch (error) {
    console.error('Error in /dashboard:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

module.exports = router;
