require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { Server } = require('socket.io');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const chargeRoutes = require('./routes/chargeRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const config = require('./config/config');
const port = process.env.PORT || config.port || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);

// ✅ Trust proxy for Render (fixes rate-limit warnings)
app.set('trust proxy', 1);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 New client connected');
  socket.on('joinBusiness', (businessId) => {
    socket.join(businessId);
    console.log(`👥 Client joined business room: ${businessId}`);
  });
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

// ✅ Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '2mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// ✅ API Routes
app.get('/health', (req, res) => res.send('OK'));
app.post('/api/auth/test', (req, res) => res.json({ msg: 'Test working' }));

app.use('/api/auth', authRoutes);
console.log('✅ Auth routes mounted at /api/auth');
app.use('/api/businesses', businessRoutes);
app.use('/api/charges', chargeRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/dashboard', dashboardRoutes);

// ❌ Removed frontend static file serving (you’re using a separate frontend service)

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ Sync DB and Start Server
console.log('🔁 Syncing Sequelize models...');
sequelize.sync({ alter: false })
  .then(() => {
    console.log('✅ Database synced');
    server.listen(port, HOST, () => {
      console.log(`🚀 Server listening on http://${HOST}:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to sync database:', err);
  });
