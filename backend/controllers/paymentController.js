const cashfreeService = require('../services/cashfreeService');
const {
  createPaymentRecord,
  getPaymentByOrderId,
  updatePaymentStatus,
  getUserCart,
} = require('../services/db');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      amount,
      userId,
      cartItems,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // VALIDATE AMOUNT FROM DATABASE (not frontend!)
    let calculatedAmount = 0;
    const userCart = await getUserCart(userId);

    if (userCart && userCart.items && userCart.items.length > 0) {
      // Calculate amount from DB cart (assume USD to INR for now - replace with real pricing!)
      // TODO: Add proper product pricing from database
      calculatedAmount = Math.round(
        userCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 83
      ); // 83 = USD to INR approx
    } else if (cartItems && cartItems.length > 0) {
      calculatedAmount = Math.round(
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 83
      );
    } else {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderId = `order_${uuidv4()}`;

    // Create payment record first
    await createPaymentRecord({
      orderId,
      userId,
      amount: calculatedAmount,
      currency: 'INR',
      status: 'PENDING',
    });

    const { paymentSessionId } = await cashfreeService.createOrder({
      customerName,
      customerEmail,
      customerPhone,
      amount: calculatedAmount,
      orderId,
    });

    res.json({
      paymentSessionId,
      orderId,
    });
  } catch (error) {
    console.error('Payment controller error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const status = await cashfreeService.getPaymentStatus(orderId);
    // Update DB record with latest status
    if (status && status.order_status) {
      await updatePaymentStatus(orderId, {
        status: status.order_status,
      });
    }

    res.json(status);
  } catch (error) {
    console.error('Payment controller error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    const orderId = webhookData.order_id;
    const orderStatus = webhookData.order_status;
    const transactionId = webhookData.payment_details?.[0]?.payment_id;
    const paymentMethod = webhookData.payment_details?.[0]?.payment_method;

    if (orderId && orderStatus) {
      // Update payment status in DB
      await updatePaymentStatus(orderId, {
        status: orderStatus,
        transactionId,
        paymentMethod,
      });

      console.log(`Updated payment for ${orderId} to ${orderStatus}`);
    }

    // Return success response to Cashfree to avoid retries
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  getPaymentStatus,
  handleWebhook,
};
