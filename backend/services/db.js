const supabase = require('../config/supabase');

/**
 * Create a new payment record in the DB
 */
const createPaymentRecord = async ({
  orderId,
  userId,
  amount,
  currency = 'INR',
  paymentSessionId,
  status = 'PENDING',
}) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('payments')
    .insert({
      order_id: orderId,
      user_id: userId,
      amount,
      currency,
      payment_session_id: paymentSessionId,
      status,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Get a payment record by order_id
 */
const getPaymentByOrderId = async (orderId) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

/**
 * Update payment status
 */
const updatePaymentStatus = async (orderId, { status, transactionId, paymentMethod }) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('payments')
    .update({
      status,
      transaction_id: transactionId,
      payment_method: paymentMethod,
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Get a user's cart from the DB
 */
const getUserCart = async (userId) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

module.exports = {
  createPaymentRecord,
  getPaymentByOrderId,
  updatePaymentStatus,
  getUserCart,
};
