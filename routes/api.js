const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Settings = require('../models/Settings');

router.get('/products', async (req, res) => {
  try {
    const cats = await Category.find({ visible: true }).sort({ tabOrder: 1 });
    const data = [];
    for (const cat of cats) {
      const products = await Product.find({ category: cat._id, visible: true })
        .sort({ sortOrder: 1 });
      if (products.length) {
        data.push({ category: cat, products });
      }
    }
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const cats = await Category.find({ visible: true }).sort({ tabOrder: 1 });
    res.json({ ok: true, data: cats });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get('/settings', async (req, res) => {
  try {
    const all = await Settings.find({});
    const map = {};
    all.forEach(s => { map[s.key] = s.value; });
    res.json({ ok: true, data: map });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
