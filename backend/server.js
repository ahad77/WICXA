const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added path module for static routing
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── SERVE ADMIN PANEL STATIC FILES ──────────────────────────────────────────
// This tells Express to serve files from your local 'admin' folder when /admin is requested
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ─── CONNECT TO MONGODB ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 Connected to MongoDB Atlas!'))
  .catch(err => console.error("Database connection error:", err));

// ─── GEMINI AI SETUP ──────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "MISSING_KEY");

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

// 2. Upload/Add new product
app.post('/api/products', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
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

// 5. Gemini AI Chatbot Route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are the official luxury styling assistant for WICXA, a premium streetwear and clothing brand in Bangladesh. 
      Keep your answers short, stylish, and highly professional. Limit responses to 2-3 sentences. 
      Prices are in BDT. Delivery inside Chattogram is BDT 80-150, outside is BDT 130. 
      Customer says: "${message}"
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    res.json({ response });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

// FALLBACK ROUTE FOR ADMIN PANEL (In case of deep client-side refreshes)
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('WICXA API Engine Active'));
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});