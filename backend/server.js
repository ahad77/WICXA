const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── CONNECT TO MONGODB ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 Connected to MongoDB Atlas!'))
  .catch(err => console.error("Database connection error:", err));

// ─── DATABASE SCHEMAS ─────────────────────────────────────────────────────────

// Product Schema (unchanged — same shape your frontend already expects)
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: String,
  description: String,
  category: String,
  images: [String],
  isActive: { type: Boolean, default: true }, // NEW — lets you hide a product without deleting it
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

// Order Schema (unchanged)
const orderSchema = new mongoose.Schema({
  orderId: String,
  customer: {
    name: String,
    phone: String,
    address: String,
    email: String,
  },
  deliveryZone: String,
  items: Array,
  totals: {
    subtotal: Number,
    deliveryFee: Number,
    discount: Number,
    grandTotal: Number
  },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ─── STATIC FILES ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));   // serves uploaded product images
app.use('/admin', express.static(path.join(__dirname, 'public')));      // serves the admin panel UI

// ─── EXISTING PUBLIC ROUTES (unchanged — your frontend keeps working as-is) ───

// 1. Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: { $ne: false } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Submit a new order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order saved successfully!", order: savedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── NEW: ADMIN ROUTES (protected — for uploading/managing products) ─────────
const adminProductRoutes = require('./routes/adminProducts')(Product);
app.use('/api/admin', adminProductRoutes);

// ─── NEW: ADMIN ORDER VIEW (so you can see incoming orders too) ──────────────
const adminOrderRoutes = require('./routes/adminOrders')(Order);
app.use('/api/admin', adminOrderRoutes);

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🛠️  Admin panel available at /admin`);
});
