require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'subdesk_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  res.locals.admin = req.session?.admin || false;
  next();
});

app.get('/health', (req, res) => {
  res.json({ ok: true, db: !!mongoose.connection.readyState, uptime: process.uptime() });
});

app.get('/', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.send('Connecting to database... please refresh in 30 seconds');
    }
    const Product = require('./models/Product');
    const Category = require('./models/Category');
    const Settings = require('./models/Settings');

    const cats = await Category.find({ visible: true }).sort({ tabOrder: 1 }).lean();
    const categories = [];
    for (const cat of cats) {
      const products = await Product.find({ category: cat._id, visible: true })
        .sort({ sortOrder: 1 }).lean();
      if (products.length) {
        categories.push({ ...cat, products });
      }
    }

    const allSettings = await Settings.find({}).lean();
    const settings = {};
    allSettings.forEach(s => { settings[s.key] = s.value; });

    const fbPage = settings.fb_page || process.env.FB_PAGE || 'https://web.facebook.com/subdeskofficial';

    res.render('index', { categories, fbPage, settings, WA_NUMBER: process.env.WA_NUMBER });
  } catch (e) {
    res.status(500).send('Server error: ' + e.message);
  }
});

app.get('/admin', (req, res) => {
  res.redirect('/admin/dashboard');
});

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).send('Not found');
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digitalsubdesk';

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

async function connectDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      tlsInsecure: true,
    });
    console.log('MongoDB connected');
  } catch (e) {
    console.log('MongoDB error:', e.message);
    if (e.name) console.log('MongoDB error name:', e.name);
    if (e.code) console.log('MongoDB error code:', e.code);
    setTimeout(connectDB, 15000);
  }
}
connectDB();
