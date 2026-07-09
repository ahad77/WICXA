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
// We initialize the Google Gemini AI using an API key from our .env variables
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

// 3. AI Chatbot Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ response: "AI is currently offline. The store owner needs to add the GEMINI_API_KEY to the server." });
    }

    // Use Gemini 1.5 Flash for fast chat responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // We give the AI a "System Prompt" so it knows how to act
    const prompt = `You are a sophisticated, elegant, and highly helpful AI shopping assistant for a premium minimalist fashion brand named "WICXA" located in Bangladesh. 
    Keep your answers very concise, friendly, and stylish. Use short paragraphs. 
    The customer says: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ response: response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ response: "I'm sorry, I am having trouble connecting to the styling network right now." });
  }
});

// ─── SERVE ADMIN PANEL STATIC FILES ──────────────────────────────────────────
app.use('/admin', express.static(path.join(__dirname, 'admin')));

app.get(['/admin', '/admin/*'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'), (err) => {
    if (err) {
      res.status(404).send("Error: Could not find the admin/index.html file. Make sure your 'admin' folder is inside the 'backend' folder and pushed to GitHub.");
    }
  });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});