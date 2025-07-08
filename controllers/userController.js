const { User, Business } = require('../models');
const config = require('../config/config');
const bcrypt = require('bcrypt');

exports.getMyAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'createdAt'],
      include: {
        model: Business,
        attributes: ['id', 'name', 'walletAddresses', 'createdAt'],
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error fetching account:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMyAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { email, password } = req.body;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: 'Account updated successfully' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error updating account:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
