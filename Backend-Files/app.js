require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const MySQLStore = require('express-mysql-session')(session);

const db = require('./db/db');
const authMiddleware = require('./middleware/authMiddleware');
const logAction = require('./middleware/logger');

const app = express();

//  Setup MySQL-based session store
const sessionStore = new MySQLStore({}, db.promise());

//  CORS (adjust for frontend origin)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//  Body parser
app.use(express.json());

//  Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false, // Use true only in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
  }
}));

//  Attach logging function to each request
app.use((req, res, next) => {
  req.logAction = logAction;
  next();
});

//  Attach auth middleware to req (optional use in route files)
app.use((req, res, next) => {
  req.authMiddleware = authMiddleware;
  next();
});

//  Route modules
app.use('/users', require('./controllers/authController'));
app.use('/vendors', require('./routes/vendors'));
app.use('/items', require('./routes/items'));
app.use('/vendor-items', require('./routes/vendorItems'));
app.use('/stock-rules', require('./controllers/stockRuleControllers'));
app.use('/activity-log', require('./routes/activityLog'));
app.use('/stock-monitor', require('./routes/stockMonitor'));

app.use('/api/po', require('./routes/purchaseOrderRoutes')); // Full PO info
app.use('/api/po', require('./routes/po_item')); // PO items
app.use('/api/items', require('./routes/items')); // optional if already used above
app.use('/api/backup', require('./routes/backup'));
app.use('/api/cleanup', require('./routes/cleanup'));
app.use('/api/pdf', require('./routes/pdfRoutes'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/binning-logs', require('./routes/binningLogs'));

app.use('/api/mrns', require('./routes/mrns'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/asn', require('./routes/asn'));
app.use('/api/notification', require('./routes/notification'));

//  Health check
app.get('/', (req, res) => {
  res.send(' Inventory Management API running');
});

module.exports = app;
