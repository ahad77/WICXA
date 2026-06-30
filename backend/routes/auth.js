const express = require('express');
const bcrypt = require('bcryptjs');

// Accepts the shared User model so the connection/model stays centralized in server.js
module.exports = function (User) {
  const router = express.Router();

  // POST /api/auth/register — create a new customer account
  router.post('/register', async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body || {};

      // Basic server-side validation (mirrors the frontend rules)
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }

      const normalizedEmail = String(email).trim().toLowerCase();

      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = new User({
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: normalizedEmail,
        passwordHash,
      });
      await user.save();

      // Never return the password hash to the client
      res.status(201).json({
        message: 'Account created successfully!',
        user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      });
    } catch (err) {
      // Handle the unique-index race condition gracefully
      if (err && err.code === 11000) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};
