require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

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
  res.json({ ok: true, uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.send('server running - node ' + process.version);
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digitalsubdesk';

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.log('MongoDB error:', e.message));
