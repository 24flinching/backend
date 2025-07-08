// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new payment (protected route)
router.post('/', authMiddleware, createPayment);

module.exports = router;
