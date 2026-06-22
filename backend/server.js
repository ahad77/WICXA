const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── CONNECT TO MONGODB ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 Connected to MongoDB Atlas!'))
  .catch(err => console.error("Database connection error:", err));

// ─── DATABASE SCHEMAS ─────────────────────────────────────────────────────────

// Product Schema
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: String,
  description: String,
  category: String,
  images: [String]
});
const Product = mongoose.model('Product', productSchema);

// Order Schema (Saves the customer checkout data)
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

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// 1. Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
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

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});