const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Mock product list
const products = [
  { id: 1, name: "Wireless Headphones", price: 99 },
  { id: 2, name: "Smart Watch", price: 149 },
  { id: 3, name: "Gaming Mouse", price: 59 },
  { id: 4, name: "Mechanical Keyboard", price: 120 },
  { id: 5, name: "Bluetooth Speaker", price: 80 }
];

let cart = [];

// GET products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET cart
app.get("/api/cart", (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ cart, total });
});

// POST add to cart
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  const product = products.find(p => p.id === productId);
  if (product) {
    const existing = cart.find(item => item.id === productId);
    if (existing) existing.qty += qty;
    else cart.push({ ...product, qty });
  }
  res.json(cart);
});

// DELETE remove from cart
app.delete("/api/cart/:id", (req, res) => {
  const id = parseInt(req.params.id);
  cart = cart.filter(item => item.id !== id);
  res.json(cart);
});

// POST checkout
app.post("/api/checkout", (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const receipt = {
    total,
    timestamp: new Date().toISOString(),
  };
  cart = [];
  res.json(receipt);
});

// Run server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
