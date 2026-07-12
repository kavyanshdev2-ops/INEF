const crypto = require('crypto');
const cashfreeConfig = require('../config/cashfree');

const validateCashfreeWebhook = (req, res, next) => {
  try {
    const timestamp = req.headers['x-webhook-timestamp'];
    const signature = req.headers['x-webhook-signature'];

    if (!timestamp || !signature) {
      return res.status(400).json({ error: 'Missing webhook headers' });
    }

    const rawBody = JSON.stringify(req.body);
    const payload = `${timestamp}${rawBody}`;

    const generatedSignature = crypto
      .createHmac('sha256', cashfreeConfig.secretKey)
      .update(payload)
      .digest('base64');

    if (generatedSignature !== signature) {
      console.warn('Cashfree webhook signature validation failed');
      return res.status(403).json({ error: 'Invalid webhook signature' });
    }

    next();
  } catch (err) {
    console.error('Webhook validation error:', err);
    return res.status(500).json({ error: 'Webhook validation failed' });
  }
};

module.exports = validateCashfreeWebhook;
