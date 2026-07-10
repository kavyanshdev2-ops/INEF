const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};
module.exports = { healthCheck };
