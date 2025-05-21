const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const stockRuleRoutes = require('./routes/stockRuleRoutes');

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
app.use('/api', stockRuleRoutes);

module.exports = app;
