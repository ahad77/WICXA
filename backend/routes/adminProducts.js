const express = require('express');
const requireAdmin = require('../middleware/requireAdmin');
const upload = require('../middleware/upload');

module.exports = function (Product) {
  const router = express.Router();
  router.use(requireAdmin); // every route below requires x-admin-key header

  // CREATE a product
  router.post('/products', upload.array('images', 6), async (req, res) => {
    try {
      const { name, price, description, category } = req.body;

      if (!name || !price || !category) {
        return res.status(400).json({ error: 'name, price, and category are required' });
      }

      const uploadedPaths = (req.files || []).map((f) => `/uploads/${f.filename}`);
      // Allow either uploaded files OR direct image URLs pasted in (comma separated)
      const urlImages = req.body.imageUrls
        ? req.body.imageUrls.split(',').map((u) => u.trim()).filter(Boolean)
        : [];

      const product = new Product({
        id: req.body.id || undefined,
        name,
        price: String(price),
        description: description || '',
        category,
        images: [...uploadedPaths, ...urlImages],
      });

      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // READ all products (admin view — includes inactive)
  router.get('/products', async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE a product
  router.put('/products/:id', upload.array('images', 6), async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      const { name, price, description, category, isActive, replaceImages } = req.body;

      if (name !== undefined) product.name = name;
      if (price !== undefined) product.price = String(price);
      if (description !== undefined) product.description = description;
      if (category !== undefined) product.category = category;
      if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;

      const newUploaded = (req.files || []).map((f) => `/uploads/${f.filename}`);
      const newUrls = req.body.imageUrls
        ? req.body.imageUrls.split(',').map((u) => u.trim()).filter(Boolean)
        : [];
      const newImages = [...newUploaded, ...newUrls];

      if (newImages.length > 0) {
        // If replaceImages=true, swap out old images entirely; otherwise append
        product.images = replaceImages === 'true' ? newImages : [...(product.images || []), ...newImages];
      }

      await product.save();
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE a product
  router.delete('/products/:id', async (req, res) => {
    try {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product deleted', id: req.params.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
