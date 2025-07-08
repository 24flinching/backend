const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getMyAccount, updateMyAccount } = require('../controllers/userController');

router.get('/me', authMiddleware, getMyAccount);
router.put('/me', authMiddleware, updateMyAccount);

module.exports = router;
