const express = require('express');
const router = express.Router();
const mockCharges = require('../mock/mockCharges');

// GET /api/charges/:businessId
router.get('/:businessId', (req, res) => {
  const { businessId } = req.params;
  const charges = mockCharges[businessId] || [];
  res.json({ charges });
});

module.exports = router;
