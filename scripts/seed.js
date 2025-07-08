const bcrypt = require('bcryptjs');
const { sequelize, User, Business, Charge } = require('../models');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Reset DB schema

    const hashedPassword = await bcrypt.hash('testpass', 10);

    // Create a test user
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword, // If you have hashing, apply it here
    });

    // Create a test business tied to user
    const business = await Business.create({
      name: 'Test Business',
      userId: user.id,
    });

    // Create some charges for that business and user
    await Charge.bulkCreate([
      {
        amount: 20.0,
        currency: 'USD',
        provider: 'coinbase',
        status: 'NEW',
        chargeId: 'charge_1',
        hostedUrl: 'https://example.com/pay/1',
        userId: user.id,
        businessId: business.id,
      },
      {
        amount: 45.5,
        currency: 'USD',
        provider: 'btcpay',
        status: 'COMPLETED',
        chargeId: 'charge_2',
        hostedUrl: 'https://example.com/pay/2',
        userId: user.id,
        businessId: business.id,
      },
    ]);

    console.log('✅ Seed data created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
