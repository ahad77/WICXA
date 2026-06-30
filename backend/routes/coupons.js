const express = require('express');

// Coupon codes live server-side so they are never exposed in the frontend bundle.
// type: 'percent' -> value is a percentage (0-100); type: 'flat' -> value is a fixed BDT amount.
const COUPONS = {
  WICXA10: { type: 'percent', value: 10, minSubtotal: 0, label: '10% off' },
  WELCOME15: { type: 'percent', value: 15, minSubtotal: 2000, label: '15% off orders over ৳2000' },
  FREESHIP: { type: 'flat', value: 80, minSubtotal: 0, label: '৳80 off' },
};

module.exports = function () {
  const router = express.Router();

  // POST /api/coupons/validate — returns the computed discount for a given code + subtotal
  router.post('/validate', (req, res) => {
    try {
      const { code, subtotal } = req.body || {};

      if (!code) {
        return res.status(400).json({ message: 'Please enter a coupon code.' });
      }

      const normalized = String(code).trim().toUpperCase();
      const coupon = COUPONS[normalized];

      if (!coupon) {
        return res.status(404).json({ message: 'Invalid coupon code.' });
      }

      const sub = Number(subtotal) || 0;
      if (sub < coupon.minSubtotal) {
        return res.status(400).json({
          message: `This code requires a minimum subtotal of ৳${coupon.minSubtotal}.`,
        });
      }

      const rawDiscount =
        coupon.type === 'percent' ? (sub * coupon.value) / 100 : coupon.value;

      // Never let the discount exceed the subtotal
      const discount = Math.round(Math.min(rawDiscount, sub));

      res.json({ discount, message: `${coupon.label} applied!` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};
