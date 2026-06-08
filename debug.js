require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
app.use(session({ secret: 't', resave: false, saveUninitialized: false }));
app.get('/health', (q, r) => r.json({ ok: true }));
app.get('/', (q, r) => r.send('debug-ok v' + process.version));
app.listen(process.env.PORT || 3000, () => console.log('SERVER STARTED'));
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('DB CONNECTED'))
  .catch(e => console.log('DB ERROR:', e.message));
