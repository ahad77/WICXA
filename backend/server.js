const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("CRITICAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('🔥 Connected to MongoDB Atlas!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Database Schema (This is the shape of your clothing items)
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  images: [String],
  category: String
});

const Product = mongoose.model('Product', productSchema);

// Initial Seed Data (Matches the mock data we had on frontend)
const generateDropTees = (category) =>
  Array.from({ length: 16 }).map((_, i) => ({
    name: `${category === 'Men' ? 'Oversized Heavy' : 'Cropped Boxy'} Drop Tee 0${i + 1}`,
    price: '1,190.00',
    description: 'Experience premium comfort and performance with our Player Edition Jersey, designed with a slim athletic fit similar to what professional players wear on the field. Made with lightweight and breathable fabric, it offers a stylish look, comfort, and flexibility for everyday wear or match days.\n\n• Material: 100% Premium 240GSM Heavyweight Cotton\n• Fit: Model is 6\'1" wearing a size Large for a relaxed, boxy drape.',
    images: category === 'Men'
        ? [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=800&auto=format&fit=crop',
          ]
        : [
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1434389678232-04ce6c4cd42b?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop',
          ],
    category: category
  }));

const seedData = [...generateDropTees('Men'), ...generateDropTees('Women')];

// --- ROUTES ---

// 1. Get all products (Frontend uses this to display items)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Seed database (This is the route you are trying to visit!)
app.get('/api/seed', async (req, res) => {
  try {
    await Product.deleteMany({}); // Clears any old data
    const created = await Product.insertMany(seedData);
    res.status(201).json({ message: "Success! Database populated.", count: created.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend API running on port ${PORT}`));