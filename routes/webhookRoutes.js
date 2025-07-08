const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Charge } = require('../models');

const COINBASE_WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET;

// Verify Coinbase webhook signature
function verifySignature(rawBody, signature) {
  const hmac = crypto.createHmac('sha256', COINBASE_WEBHOOK_SECRET);
  hmac.update(rawBody, 'utf8');
  const digest = hmac.digest('hex');
  return digest === signature;
}

// Coinbase Commerce webhook handler
router.post('/coinbase', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-cc-webhook-signature'];
    const rawBody = req.body.toString();

    if (!verifySignature(rawBody, signature)) {
      console.error('❌ Coinbase webhook signature verification failed');
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(rawBody);
    console.log('📩 Coinbase webhook event:', event?.type);

    const chargeCode = event?.data?.code;
    const eventType = event?.type;

    if (!chargeCode || !eventType) {
      console.warn('⚠️ Missing charge code or event type in webhook');
      return res.status(400).send('Invalid event');
    }

    const charge = await Charge.findOne({ where: { chargeId: chargeCode } });

    if (!charge) {
      console.warn(`⚠️ Charge with chargeId ${chargeCode} not found`);
      return res.status(404).send('Charge not found');
    }

    if (eventType === 'charge:confirmed') {
      charge.status = 'confirmed';
    } else if (eventType === 'charge:failed') {
      charge.status = 'failed';
    } else {
      return res.status(200).send('Event ignored');
    }

    await charge.save();
    console.log(`✅ Charge ${chargeCode} marked as ${charge.status}`);

    // Emit to connected clients in the specific business room
    const io = req.app.get('io');
    if (io) {
      io.to(charge.businessId.toString()).emit('chargeUpdated', {
        chargeId: charge.id,
        status: charge.status,
      });
    }

    return res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('❌ Exception in webhook handler:', err);
    return res.status(500).send('Internal server error');
  }
});

// BTCPay Server webhook handler
router.post('/btcpay', async (req, res) => {
  try {
    const event = req.body;
    const invoiceId = event?.invoiceId;
    const newStatus = event?.type; // e.g. "InvoiceSettled", "InvoiceExpired"

    if (!invoiceId || !newStatus) {
      console.warn('⚠️ Missing invoiceId or type in BTCPay webhook');
      return res.status(400).send('Invalid event');
    }

    const charge = await Charge.findOne({ where: { chargeId: invoiceId } });
    if (!charge) {
      console.warn(`⚠️ Charge with chargeId ${invoiceId} not found`);
      return res.status(404).send('Charge not found');
    }

    // Map BTCPay event types to internal charge status
    if (newStatus === 'InvoiceSettled') {
      charge.status = 'confirmed';
    } else if (newStatus === 'InvoiceExpired') {
      charge.status = 'expired';
    } else {
      console.log(`ℹ️ BTCPay webhook type "${newStatus}" ignored`);
      return res.status(200).send('Event ignored');
    }

    await charge.save();
    console.log(`✅ Charge ${invoiceId} marked as ${charge.status}`);

    // Emit to clients in the business room
    const io = req.app.get('io');
    if (io) {
      io.to(charge.businessId.toString()).emit('chargeUpdated', {
        chargeId: charge.id,
        status: charge.status,
      });
    }

    return res.status(200).send('BTCPay webhook processed');
  } catch (err) {
    console.error('❌ Error in BTCPay webhook handler:', err);
    return res.status(500).send('Internal server error');
  }
});

module.exports = router;
