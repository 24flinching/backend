const { Charge } = require('../models');
const config = require('../config/config');

exports.handleCoinbaseWebhook = async (req, res) => {
  const event = req.body.event;

  if (!event || !event.data || !event.id) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  try {
    const chargeId = event.data.id;
    const newStatus = event.type.replace('charge:', ''); // e.g. 'confirmed'

    const charge = await Charge.findOne({ where: { chargeId } });
    if (!charge) {
      return res.status(404).json({ error: 'Charge not found' });
    }

    charge.status = newStatus;
    await charge.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Webhook error:`, err);
    res.status(500).json({ error: 'Server error' });
  }
};
