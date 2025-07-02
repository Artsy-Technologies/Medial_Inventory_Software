const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const stockRuleRoutes = require('./routes/stockRuleRoutes');
const poRoutes = require('./routes/purchaseOrderRoutes');
const itemRoutes = require('./routes/itemRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const vendorItemRoutes = require('./routes/vendorItemRoutes');

const app = express();
   
require('dotenv').config();

app.use(cors({
  origin: 'http://localhost:5173', // frontend dev server
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

app.use('/api', authRoutes);
app.use('/api/stock-rule', stockRuleRoutes);
app.use('/api/po', poRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/vendor-items', vendorItemRoutes);

module.exports = app;
