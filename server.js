require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();

/* ───── View engine ───── */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ───── Middleware ───── */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'subdesk_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/digitalsubdesk' }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

/* ───── Make session available in templates ───── */
app.use((req, res, next) => {
  res.locals.admin = req.session?.admin || false;
  next();
});

/* ───── Routes ───── */
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

/* ───── Public homepage ───── */
app.get('/', async (req, res) => {
  try {
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

/* ───── 404 ───── */
app.use((req, res) => {
  res.status(404).send('Not found');
});

/* ───── Start ───── */
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digitalsubdesk';

let dbConnected = false;

app.use((req, res, next) => {
  res.locals.dbConnected = dbConnected;
  next();
});

app.get('/health', (req, res) => {
  res.json({ ok: true, dbConnected, uptime: process.uptime() });
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    dbConnected = true;
    console.log('MongoDB connected');
  })
  .catch(e => {
    console.error('MongoDB connection error:', e.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Admin panel: http://localhost:${PORT}/admin/login`);
    });
  });
