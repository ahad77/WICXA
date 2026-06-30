// Simple admin authentication — checks a secret key sent in request headers.
// Upgrade to full login + JWT once you have multiple staff accounts.

module.exports = function requireAdmin(req, res, next) {
  const providedKey = req.headers['x-admin-key'];
  const realKey = process.env.ADMIN_SECRET_KEY;

  if (!realKey) {
    return res.status(500).json({ error: 'Server misconfigured: ADMIN_SECRET_KEY not set in .env' });
  }
  if (!providedKey || providedKey !== realKey) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing admin key' });
  }
  next();
};
