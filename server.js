const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { getUserByBusinessId } = require('./models/userModel');
const { createCoinbaseCharge } = require('./paymentProviders/coinbase');
const { createBTCPayCharge } = require('./paymentProviders/btcpay');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/create-payment', async (req, res) => {
  const { businessId, amount, currency } = req.body;

  if (!businessId || !amount || !currency) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const user = await getUserByBusinessId(businessId);

    if (!user) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    let charge;

    switch (user.provider) {
      case 'coinbase':
        charge = await createCoinbaseCharge(user, amount, currency);
        break;
      case 'btcpay':
        charge = await createBTCPayCharge(user, amount, currency);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported payment provider.' });
    }

    return res.json({ charge });
  } catch (err) {
    console.error('Error creating payment:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
