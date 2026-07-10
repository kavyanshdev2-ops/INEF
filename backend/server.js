require('dotenv').config({ path: require('path').join(__dirname, '.env.example') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Request ID middleware
app.use((req, res, next) => { req.id = uuidv4(); next(); });

// Routes
app.use('/api/v1', require('./routes'));

// 404 handler
app.use((req, res) => { res.status(404).json({ status: 'error', message: 'Not Found' }); });

// Central error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  res.status(status).json({ status: 'error', message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT} in ${ENV} mode`);
});
