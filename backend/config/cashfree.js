const { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_ENV, FRONTEND_URL, BACKEND_URL } = process.env;

module.exports = {
  appId: CASHFREE_APP_ID,
  secretKey: CASHFREE_SECRET_KEY,
  env: CASHFREE_ENV,
  frontendUrl: FRONTEND_URL,
  backendUrl: BACKEND_URL,
  baseUrl: CASHFREE_ENV === 'SANDBOX'
    ? 'https://sandbox.cashfree.com/pg'
    : 'https://api.cashfree.com/pg',
  apiVersion: '2022-09-01'
};
