const { v4: uuidv4 } = require('uuid');
const cashfreeConfig = require('../config/cashfree');

const createOrder = async ({ customerName, customerEmail, customerPhone, amount, orderId: providedOrderId }) => {
  const orderId = providedOrderId || `order_${uuidv4()}`;
  const customerId = `customer_${uuidv4()}`;

  const returnUrl = `${cashfreeConfig.frontendUrl}/payment-success?order_id={order_id}`;
  const notifyUrl = `${cashfreeConfig.backendUrl}/api/v1/payment/webhook`;

  const requestBody = {
    order_id: orderId,
    order_amount: parseFloat(amount),
    order_currency: 'INR',
    customer_details: {
      customer_id: customerId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: notifyUrl,
      payment_methods: 'cc,dc,upi,netbanking,wallet',
    },
  };

  try {
    const response = await fetch(`${cashfreeConfig.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-api-version': cashfreeConfig.apiVersion,
        'x-client-id': cashfreeConfig.appId,
        'x-client-secret': cashfreeConfig.secretKey,
      },
      body: JSON.stringify(requestBody),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(`Cashfree API error: ${response.status} - ${responseBody}`);
    }

    const orderData = JSON.parse(responseBody);

    return {
      paymentSessionId: orderData.payment_session_id,
      orderId: orderData.order_id,
      orderAmount: orderData.order_amount,
      orderStatus: orderData.order_status,
    };
  } catch (error) {
    console.error('Cashfree service error:', error);
    throw error;
  }
};

const getPaymentStatus = async (orderId) => {
  try {
    const response = await fetch(`${cashfreeConfig.baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-api-version': cashfreeConfig.apiVersion,
        'x-client-id': cashfreeConfig.appId,
        'x-client-secret': cashfreeConfig.secretKey,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Cashfree API error: ${response.status} - ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Cashfree service error:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getPaymentStatus,
};
