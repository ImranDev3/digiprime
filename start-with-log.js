const fs = require('fs');
const path = require('path');

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(path.join(__dirname, 'startup.log'), line + '\n'); } catch(e) {}
}

log('Starting Digital SubDesk...');
log('Node version: ' + process.version);
log('MONGODB_URI: ' + (process.env.MONGODB_URI ? 'SET (' + process.env.MONGODB_URI.substring(0, 40) + '...)' : 'NOT SET'));
log('PORT: ' + (process.env.PORT || '3000'));

try {
  log('Loading dotenv...');
  require('dotenv').config();
  log('dotenv loaded');
} catch (e) { log('dotenv ERROR: ' + e.message); }

try {
  log('Loading express...');
  const express = require('express');
  log('express loaded');
} catch (e) { log('express ERROR: ' + e.message); }

try {
  log('Loading mongoose...');
  const mongoose = require('mongoose');
  log('mongoose loaded');
} catch (e) { log('mongoose ERROR: ' + e.message); }

try {
  log('Loading express-session...');
  const session = require('express-session');
  log('express-session loaded');
} catch (e) { log('express-session ERROR: ' + e.message); }

try {
  log('Loading connect-mongo...');
  const MongoStore = require('connect-mongo');
  log('connect-mongo loaded');
} catch (e) { log('connect-mongo ERROR: ' + e.message); }

try {
  log('Loading models...');
  require('./models/Product');
  require('./models/Category');
  require('./models/Settings');
  log('models loaded');
} catch (e) { log('models ERROR: ' + e.message); }

try {
  log('Loading routes...');
  require('./routes/api');
  require('./routes/admin');
  log('routes loaded');
} catch (e) { log('routes ERROR: ' + e.message); }

log('All modules loaded successfully!');

// Now try to start the server
try {
  log('Loading server.js...');
  require('./server');
} catch (e) {
  log('server.js ERROR: ' + e.message);
  log('STACK: ' + e.stack);
}

// Serve the log file
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  try {
    const logData = fs.readFileSync(path.join(__dirname, 'startup.log'), 'utf8');
    res.end(logData);
  } catch (e) {
    res.end('No log file yet');
  }
}).listen(PORT, () => log('Log server listening on ' + PORT));
