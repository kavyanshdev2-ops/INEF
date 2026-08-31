import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 5000);
const cashfreeBaseUrl = process.env.CASHFREE_ENV === 'SANDBOX'
  ? 'https://sandbox.cashfree.com/pg'
  : 'https://api.cashfree.com/pg';
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed'));
  }
}));
app.use(express.json({ limit: '100kb' }));

const cashfreeHeaders = () => ({
  'Content-Type': 'application/json',
  'x-client-id': process.env.CASHFREE_APP_ID,
  'x-client-secret': process.env.CASHFREE_SECRET_KEY,
  'x-api-version': '2023-08-01'
});

const getOrderId = () => `INEF_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

app.get('/health', (_req, res) => {
  res.json({ ok: true, cashfreeConfigured: Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY) });
});

app.post('/api/v1/payment/create-order', async (req, res) => {
  const { customerName, customerEmail, customerPhone, userId, cartItems } = req.body;

  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    return res.status(503).json({ message: 'Cashfree is not configured on the payment server.' });
  }
  if (!customerName || !customerEmail || !customerPhone || !userId || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: 'Customer details and cart items are required.' });
  }
  if (!/^\\d{10}$/.test(String(customerPhone).replace(/\\D/g, ''))) {
    return res.status(400).json({ message: 'Enter a valid 10-digit phone number.' });
  }

  const items = cartItems.map((item) => ({
    id: String(item.id),
    name: String(item.name).slice(0, 100),
    price: Number(item.price),
    quantity: Number(item.quantity)
  }));
  const invalidItem = items.some((item) => !Number.isFinite(item.price) || item.price <= 0 || !Number.isInteger(item.quantity) || item.quantity <= 0);
  if (invalidItem) {
    return res.status(400).json({ message: 'Cart contains an invalid item.' });
  }

  const amount = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  const orderId = getOrderId();
  const frontendUrl = process.env.FRONTEND_URL || allowedOrigins[0] || 'http://localhost:5173';

  try {
    const response = await fetch(`${cashfreeBaseUrl}/orders`, {
      method: 'POST',
      headers: { ...cashfreeHeaders(), 'x-request-id': orderId },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: process.env.CASHFREE_CURRENCY || 'INR',
        customer_details: {
          customer_id: String(userId),
          customer_name: String(customerName).slice(0, 100),
          customer_email: String(customerEmail).slice(0, 150),
          customer_phone: String(customerPhone).replace(/\\D/g, '')
        },
        order_meta: {
          return_url: `${frontendUrl}/payment/success?order_id={order_id}`,
          notify_url: process.env.CASHFREE_NOTIFY_URL || undefined
        },
        order_note: `INEFFABLE order for ${items.length} item(s)`
      })
    });
    const result = await response.json();
    if (!response.ok || !result.payment_session_id) {
      return res.status(response.status || 502).json({ message: result.message || 'Cashfree order creation failed.' });
    }
    return res.json({ paymentSessionId: result.payment_session_id, orderId });
  } catch (error) {
    console.error('Cashfree order creation failed:', error);
    return res.status(502).json({ message: 'Payment provider is unavailable.' });
  }
});

app.get('/api/v1/payment/status/:orderId', async (req, res) => {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    return res.status(503).json({ message: 'Cashfree is not configured on the payment server.' });
  }
  try {
    const response = await fetch(`${cashfreeBaseUrl}/orders/${encodeURIComponent(req.params.orderId)}`, {
      headers: cashfreeHeaders()
    });
    const result = await response.json();
    return res.status(response.status).json(result);
  } catch (error) {
    console.error('Cashfree status lookup failed:', error);
    return res.status(502).json({ message: 'Payment provider is unavailable.' });
  }
});

app.listen(port, () => {
  console.log(`INEFFABLE payment API listening on port ${port}`);
});
