const express = require('express');
const requireAdmin = require('../middleware/requireAdmin');

module.exports = function (Order) {
  const router = express.Router();
  router.use(requireAdmin);

  // View all orders, most recent first
  router.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
