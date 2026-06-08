const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Settings = require('../models/Settings');
const { requireAdmin, redirectIfLoggedIn } = require('../middleware/auth');

/* ───── Login ───── */
router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('admin/login', { error: null });
});

router.post('/login', redirectIfLoggedIn, async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.admin = true;
    return res.redirect('/admin/dashboard');
  }
  const hash = await bcrypt.hash(process.env.ADMIN_PASS, 10);
  const match = await bcrypt.compare(password, hash);
  if (username === process.env.ADMIN_USER && match) {
    req.session.admin = true;
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: 'Invalid credentials' });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

/* ───── Dashboard ───── */
router.get('/dashboard', requireAdmin, async (req, res) => {
  const productCount = await Product.countDocuments();
  const catCount = await Category.countDocuments();
  const visibleCount = await Product.countDocuments({ visible: true });
  const catRows = await Category.find().sort({ tabOrder: 1 }).lean();
  const perCat = [];
  for (const c of catRows) {
    const n = await Product.countDocuments({ category: c._id });
    perCat.push({ name: c.name, count: n });
  }
  res.render('admin/dashboard', { productCount, catCount, visibleCount, perCat });
});

/* ───── Products ───── */
router.get('/products', requireAdmin, async (req, res) => {
  const products = await Product.find().populate('category').sort({ sortOrder: 1 }).lean();
  res.render('admin/products', { products });
});

router.get('/products/new', requireAdmin, async (req, res) => {
  const categories = await Category.find().sort({ tabOrder: 1 }).lean();
  res.render('admin/product-form', { product: null, categories, error: null });
});

router.post('/products/new', requireAdmin, async (req, res) => {
  try {
    const { name, category, badge, badgeClass, sortOrder, variations } = req.body;
    const parsedVariations = Array.isArray(variations?.label)
      ? variations.label.map((_, i) => ({
          label: variations.label[i],
          price: Number(variations.price[i]) || 0,
          pkg: (variations.pkg && variations.pkg[i]) || ''
        }))
      : [];
    await Product.create({
      name, category, badge: badge || '', badgeClass: badgeClass || '',
      sortOrder: Number(sortOrder) || 0, variations: parsedVariations
    });
    res.redirect('/admin/products');
  } catch (e) {
    const categories = await Category.find().sort({ tabOrder: 1 }).lean();
    res.render('admin/product-form', { product: null, categories, error: e.message });
  }
});

router.get('/products/edit/:id', requireAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  const categories = await Category.find().sort({ tabOrder: 1 }).lean();
  if (!product) return res.redirect('/admin/products');
  res.render('admin/product-form', { product, categories, error: null });
});

router.post('/products/edit/:id', requireAdmin, async (req, res) => {
  try {
    const { name, category, badge, badgeClass, sortOrder, variations } = req.body;
    const parsedVariations = Array.isArray(variations?.label)
      ? variations.label.map((_, i) => ({
          label: variations.label[i],
          price: Number(variations.price[i]) || 0,
          pkg: (variations.pkg && variations.pkg[i]) || ''
        }))
      : [];
    await Product.findByIdAndUpdate(req.params.id, {
      name, category, badge: badge || '', badgeClass: badgeClass || '',
      sortOrder: Number(sortOrder) || 0, variations: parsedVariations
    });
    res.redirect('/admin/products');
  } catch (e) {
    const product = await Product.findById(req.params.id).lean();
    const categories = await Category.find().sort({ tabOrder: 1 }).lean();
    res.render('admin/product-form', { product, categories, error: e.message });
  }
});

router.post('/products/toggle/:id', requireAdmin, async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (p) { p.visible = !p.visible; await p.save(); }
  res.redirect('/admin/products');
});

router.post('/products/delete/:id', requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products');
});

/* ───── Categories ───── */
router.get('/categories', requireAdmin, async (req, res) => {
  const categories = await Category.find().sort({ tabOrder: 1 }).lean();
  const counts = {};
  for (const c of categories) {
    counts[c._id] = await Product.countDocuments({ category: c._id });
  }
  res.render('admin/categories', { categories, counts, error: null });
});

router.post('/categories/create', requireAdmin, async (req, res) => {
  try {
    const { name, slug, tabOrder } = req.body;
    await Category.create({
      name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      tabOrder: Number(tabOrder) || 0
    });
    res.redirect('/admin/categories');
  } catch (e) {
    const categories = await Category.find().sort({ tabOrder: 1 }).lean();
    const counts = {};
    for (const c of categories) counts[c._id] = await Product.countDocuments({ category: c._id });
    res.render('admin/categories', { categories, counts, error: e.message });
  }
});

router.post('/categories/edit/:id', requireAdmin, async (req, res) => {
  try {
    const { name, slug, tabOrder } = req.body;
    await Category.findByIdAndUpdate(req.params.id, {
      name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      tabOrder: Number(tabOrder) || 0
    });
    res.redirect('/admin/categories');
  } catch (e) {
    const categories = await Category.find().sort({ tabOrder: 1 }).lean();
    const counts = {};
    for (const c of categories) counts[c._id] = await Product.countDocuments({ category: c._id });
    res.render('admin/categories', { categories, counts, error: e.message });
  }
});

router.post('/categories/toggle/:id', requireAdmin, async (req, res) => {
  const c = await Category.findById(req.params.id);
  if (c) { c.visible = !c.visible; await c.save(); }
  res.redirect('/admin/categories');
});

router.post('/categories/delete/:id', requireAdmin, async (req, res) => {
  await Product.deleteMany({ category: req.params.id });
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/admin/categories');
});

/* ───── Settings ───── */
router.get('/settings', requireAdmin, async (req, res) => {
  const all = await Settings.find({}).lean();
  const map = {};
  all.forEach(s => { map[s.key] = s.value; });
  res.render('admin/settings', {
    settings: map,
    waNumber: process.env.WA_NUMBER,
    fbPage: process.env.FB_PAGE,
    error: null
  });
});

router.post('/settings', requireAdmin, async (req, res) => {
  try {
    for (const key of Object.keys(req.body)) {
      await Settings.findOneAndUpdate(
        { key },
        { value: req.body[key] },
        { upsert: true }
      );
    }
    res.redirect('/admin/settings');
  } catch (e) {
    const all = await Settings.find({}).lean();
    const map = {};
    all.forEach(s => { map[s.key] = s.value; });
    res.render('admin/settings', {
      settings: map,
      waNumber: process.env.WA_NUMBER,
      fbPage: process.env.FB_PAGE,
      error: e.message
    });
  }
});

module.exports = router;
