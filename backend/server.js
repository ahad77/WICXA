const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── AI SETUP (GEMINI) ────────────────────────────────────────────────────────
// Initialize the Google Gemini AI using the API key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── CONNECT TO MONGODB ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 Connected to MongoDB Atlas!'))
  .catch(err => console.error("Database connection error:", err));

// ─── DATABASE SCHEMAS ─────────────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: String,
  description: String,
  category: String,
  images: [String]
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
  orderId: String,
  customer: { name: String, phone: String, address: String, email: String },
  deliveryZone: String,
  items: Array,
  totals: { subtotal: Number, deliveryFee: Number, discount: Number, grandTotal: Number },
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

// 2. Upload/Add new product (THIS FIXES YOUR ADMIN UPLOAD ISSUE)
app.post('/api/products', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ message: "Unauthorized. Invalid Admin Key." });
  }

  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: savedProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Submit a new order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order saved successfully!", order: savedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Validate Coupon
app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (code === 'WICXA10') {
    res.json({ discount: subtotal * 0.10, message: '10% Discount Applied!' });
  } else if (code === 'FREESHIP') {
    res.json({ discount: 150, message: 'Free Shipping Applied!' });
  } else {
    res.status(400).json({ message: 'Invalid coupon code' });
  }
});