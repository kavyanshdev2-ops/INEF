const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const validateCashfreeWebhook = require('../middleware/validateCashfreeWebhook');

router.post('/create-order', paymentController.createOrder);
router.get('/status/:orderId', paymentController.getPaymentStatus);
router.post(
  '/webhook',
  validateCashfreeWebhook,
  paymentController.handleWebhook
);

module.exports = router;
