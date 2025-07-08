const { Charge, Business } = require('../models');
const btcpay = require('../providers/btcpayProvider');
const coinbase = require('../providers/coinbaseProvider');
const config = require('../config/config');

exports.createCharge = async (req, res) => {
  const { amount, currency, provider, businessId } = req.body;
  const userId = req.user.id;

  console.log('🔍 Incoming charge request:', { amount, currency, provider, businessId, userId });

  try {
    // Check if business exists and belongs to user
    const business = await Business.findOne({ where: { id: businessId, userId } });
    if (!business) {
      return res.status(403).json({ error: 'Business not found or not authorized' });
    }

    // Validate required wallet info per provider
    if (provider === 'btcpay' && !business.wallets?.btc) {
      return res.status(400).json({ error: 'Missing BTCPay wallet address for this business' });
    }

    console.log('💼 Wallets:', business.wallets);
    if (provider === 'coinbase' && !business.wallets?.coinbase) {
      return res.status(400).json({ error: 'Missing Coinbase API key for this business' });
    }

    // Create charge via provider
    let chargeData;
    if (provider === 'btcpay') {
      chargeData = await btcpay.createCharge({
        amount,
        currency,
        address: business.wallets.btc,
      });
    } else if (provider === 'coinbase') {
      chargeData = await coinbase.createCharge({
        amount,
        currency,
        apiKey: business.wallets.coinbase,
      });
    } else {
      return res.status(400).json({ error: 'Unsupported provider' });
    }

    // Normalize payment URL
    const paymentUrl = chargeData.hosted_url || chargeData.paymentLink || chargeData.btcAddress || null;

    // Save charge in DB
    const newCharge = await Charge.create({
      amount,
      currency,
      provider,
      chargeId: chargeData.id,
      status: chargeData.status || 'pending',
      paymentUrl,
      businessId,
      userId,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(businessId.toString()).emit('newCharge', {
        id: newCharge.id,
        amount: newCharge.amount,
        currency: newCharge.currency,
        provider: newCharge.provider,
        status: newCharge.status,
        paymentUrl,
        createdAt: newCharge.createdAt,
      });
    }

    res.status(201).json({
      id: newCharge.id,
      amount: newCharge.amount,
      currency: newCharge.currency,
      provider: newCharge.provider,
      status: newCharge.status,
      paymentUrl,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error creating charge:`, {
      message: error.message,
      stack: error.stack,
      name: error.name,
      errors: error.errors || null,
    });

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getChargesByBusinessId = async (req, res) => {
  const { businessId } = req.params;
  const userId = req.user.id;

  try {
    if (!businessId) return res.status(400).json({ error: 'Business ID is required' });

    const business = await Business.findOne({ where: { id: businessId, userId } });
    if (!business) return res.status(403).json({ error: 'Business not found or not authorized' });

    const charges = await Charge.findAll({ where: { businessId } });

    res.json({ charges });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error fetching charges:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
