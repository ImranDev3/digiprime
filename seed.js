require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Settings = require('./models/Settings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digitalsubdesk';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  /* ───── Clear existing data ───── */
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Settings.deleteMany({})
  ]);
  console.log('Cleared existing data');

  /* ───── Categories ───── */
  const categories = await Category.insertMany([
    { name: 'Streaming', slug: 'streaming', tabOrder: 1 },
    { name: 'VPN', slug: 'vpn', tabOrder: 2 },
    { name: 'AI & Tools', slug: 'ai', tabOrder: 3 },
    { name: 'Software', slug: 'software', tabOrder: 4 },
    { name: 'Education', slug: 'education', tabOrder: 5 },
    { name: 'Gift Cards', slug: 'gift', tabOrder: 6 }
  ]);
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c._id; });
  console.log('Created 6 categories');

  /* ───── Products ───── */
  await Product.insertMany([
    /* ───── Streaming ───── */
    { name: 'Netflix Premium', category: catMap.streaming, sortOrder: 1, variations: [
      { label: '1 Month · 1 Screen HD', pkg: '1 Month · 1 Screen HD', price: 350 },
      { label: '1 Month · 4K UHD · 4 Screens', pkg: '1 Month · 4K UHD 4 Screens', price: 650 },
      { label: '3 Months · 4K UHD · 4 Screens', pkg: '3 Months · 4K 4 Screens', price: 1500 },
      { label: '6 Months · 4K UHD · 4 Screens', pkg: '6 Months · 4K 4 Screens', price: 2500 },
      { label: '12 Months · 4K UHD · 4 Screens', pkg: '12 Months · 4K 4 Screens', price: 4000 }
    ]},
    { name: 'Netflix Premium', category: catMap.streaming, sortOrder: 2, badge: 'popular', variations: [
      { label: '1 Month · 1 Screen HD', pkg: '1 Month · 1 Screen HD', price: 350 },
      { label: '1 Month · 4K UHD · 4 Screens', pkg: '1 Month · 4K 4 Screens', price: 650 },
      { label: '3 Months · 4K UHD · 4 Screens', pkg: '3 Months · 4K 4 Screens', price: 1500 },
      { label: '6 Months · 4K UHD · 4 Screens', pkg: '6 Months · 4K 4 Screens', price: 2500 }
    ]},
    { name: 'Amazon Prime Video', category: catMap.streaming, sortOrder: 3, variations: [
      { label: '1 Month · Full Access', pkg: '1 Month · Full Access', price: 250 },
      { label: '3 Months · Full Access', pkg: '3 Months · Full Access', price: 600 },
      { label: '6 Months · Full Access', pkg: '6 Months · Full Access', price: 1000 },
      { label: '12 Months · Full Access', pkg: '12 Months · Full Access', price: 1800 }
    ]},
    { name: 'Disney+ Hotstar', category: catMap.streaming, sortOrder: 4, variations: [
      { label: '1 Month · Super Plan', pkg: '1 Month · Super Plan', price: 299 },
      { label: '3 Months · Super Plan', pkg: '3 Months · Super Plan', price: 699 },
      { label: '12 Months · Super Plan', pkg: '12 Months · Super Plan', price: 1499 }
    ]},
    { name: 'HBO Max', category: catMap.streaming, sortOrder: 5, variations: [
      { label: '1 Month · Standard', pkg: '1 Month · Standard', price: 450 },
      { label: '3 Months · Standard', pkg: '3 Months · Standard', price: 1100 },
      { label: '6 Months · Standard', pkg: '6 Months · Standard', price: 2000 },
      { label: '12 Months · Standard', pkg: '12 Months · Standard', price: 3500 }
    ]},
    { name: 'YouTube Premium', category: catMap.streaming, sortOrder: 6, badge: 'trending', badgeClass: 'badge-trending', variations: [
      { label: '1 Month · Family Plan', pkg: '1 Month · Family Plan', price: 399 },
      { label: '3 Months · Family Plan', pkg: '3 Months · Family Plan', price: 999 },
      { label: '6 Months · Family Plan', pkg: '6 Months · Family Plan', price: 1799 },
      { label: '12 Months · Family Plan', pkg: '12 Months · Family Plan', price: 2999 }
    ]},
    { name: 'Spotify Premium', category: catMap.streaming, sortOrder: 7, badge: 'trending', badgeClass: 'badge-trending', variations: [
      { label: '1 Month · Ad-Free', pkg: '1 Month · Ad-Free', price: 179 },
      { label: '3 Months · Ad-Free', pkg: '3 Months · Ad-Free', price: 450 },
      { label: '6 Months · Ad-Free', pkg: '6 Months · Ad-Free', price: 799 },
      { label: '12 Months · Ad-Free', pkg: '12 Months · Ad-Free', price: 1399 }
    ]},

    /* ───── VPN ───── */
    { name: 'NordVPN', category: catMap.vpn, sortOrder: 1, badge: 'best-seller', variations: [
      { label: '1 Month · 6,000+ Servers', pkg: '1 Month · 6000+ Servers', price: 299 },
      { label: '3 Months · 6,000+ Servers', pkg: '3 Months · 6000+ Servers', price: 699 },
      { label: '6 Months · 6,000+ Servers', pkg: '6 Months · 6000+ Servers', price: 999 },
      { label: '12 Months · 6,000+ Servers', pkg: '12 Months · 6000+ Servers', price: 1499 }
    ]},
    { name: 'ExpressVPN', category: catMap.vpn, sortOrder: 2, badge: 'popular', variations: [
      { label: '1 Month · 3,000+ Servers', pkg: '1 Month · 3000+ Servers', price: 399 },
      { label: '3 Months · 3,000+ Servers', pkg: '3 Months · 3000+ Servers', price: 999 },
      { label: '6 Months · 3,000+ Servers', pkg: '6 Months · 3000+ Servers', price: 1799 }
    ]},
    { name: 'IPVanish', category: catMap.vpn, sortOrder: 3, variations: [
      { label: '1 Month · Unlimited Devices', pkg: '1 Month · Unlimited Devices', price: 249 },
      { label: '3 Months · Unlimited Devices', pkg: '3 Months · Unlimited Devices', price: 599 },
      { label: '12 Months · Unlimited Devices', pkg: '12 Months · Unlimited Devices', price: 1499 }
    ]},
    { name: 'CyberGhost', category: catMap.vpn, sortOrder: 4, variations: [
      { label: '1 Month · 7 Devices', pkg: '1 Month · 7 Devices', price: 199 },
      { label: '3 Months · 7 Devices', pkg: '3 Months · 7 Devices', price: 499 },
      { label: '12 Months · 7 Devices', pkg: '12 Months · 7 Devices', price: 1299 }
    ]},

    /* ───── AI & Tools ───── */
    { name: 'ChatGPT Plus', category: catMap.ai, sortOrder: 1, badge: 'hot', variations: [
      { label: '1 Month · GPT-4 & DALL·E', pkg: '1 Month · GPT-4 + DALL-E', price: 999 },
      { label: '3 Months · GPT-4 & DALL·E', pkg: '3 Months · GPT-4 + DALL-E', price: 2499 },
      { label: '6 Months · GPT-4 & DALL·E', pkg: '6 Months · GPT-4 + DALL-E', price: 4499 },
      { label: '12 Months · GPT-4 & DALL·E', pkg: '12 Months · GPT-4 + DALL-E', price: 7999 }
    ]},
    { name: 'Canva Pro (EDU)', category: catMap.ai, sortOrder: 2, badge: 'sale', variations: [
      { label: '1 Month · Team Account', pkg: '1 Month · Team Account', price: 199 },
      { label: '3 Months · Team Account', pkg: '3 Months · Team Account', price: 499 },
      { label: '6 Months · Team Account', pkg: '6 Months · Team Account', price: 899 },
      { label: '12 Months · Team Account', pkg: '12 Months · Team Account', price: 1499 }
    ]},
    { name: 'Adobe Creative Cloud', category: catMap.ai, sortOrder: 3, variations: [
      { label: '1 Month · All Apps', pkg: '1 Month · All Apps', price: 1999 },
      { label: '3 Months · All Apps', pkg: '3 Months · All Apps', price: 4999 },
      { label: '6 Months · All Apps', pkg: '6 Months · All Apps', price: 8999 },
      { label: '12 Months · All Apps', pkg: '12 Months · All Apps', price: 14999 }
    ]},
    { name: 'CapCut Pro', category: catMap.ai, sortOrder: 4, variations: [
      { label: '1 Month · Pro Features', pkg: '1 Month · Pro Features', price: 349 },
      { label: '3 Months · Pro Features', pkg: '3 Months · Pro Features', price: 849 },
      { label: '12 Months · Pro Features', pkg: '12 Months · Pro Features', price: 2499 }
    ]},
    { name: 'QuillBot Premium', category: catMap.ai, sortOrder: 5, badge: 'sale', variations: [
      { label: '1 Month · Unlimited', pkg: '1 Month · Unlimited', price: 179 },
      { label: '3 Months · Unlimited', pkg: '3 Months · Unlimited', price: 449 },
      { label: '6 Months · Unlimited', pkg: '6 Months · Unlimited', price: 799 },
      { label: '12 Months · Unlimited', pkg: '12 Months · Unlimited', price: 1199 }
    ]},
    { name: 'Perplexity AI Pro', category: catMap.ai, sortOrder: 6, variations: [
      { label: '1 Month · Pro Search', pkg: '1 Month · Pro Search', price: 199 },
      { label: '3 Months · Pro Search', pkg: '3 Months · Pro Search', price: 499 },
      { label: '12 Months · Pro Search', pkg: '12 Months · Pro Search', price: 1499 }
    ]},
    { name: 'Grok AI', category: catMap.ai, sortOrder: 7, variations: [
      { label: '1 Month · Premium', pkg: '1 Month · Premium', price: 399 },
      { label: '3 Months · Premium', pkg: '3 Months · Premium', price: 999 },
      { label: '6 Months · Premium', pkg: '6 Months · Premium', price: 1799 },
      { label: '12 Months · Premium', pkg: '12 Months · Premium', price: 2999 }
    ]},
    { name: 'Google AI Pro', category: catMap.ai, sortOrder: 8, variations: [
      { label: '1 Month · Veo 3 Video Gen', pkg: '1 Month · with Veo 3', price: 899 },
      { label: '3 Months · Veo 3 Video Gen', pkg: '3 Months · with Veo 3', price: 2199 },
      { label: '6 Months · Veo 3 Video Gen', pkg: '6 Months · with Veo 3', price: 3999 }
    ]},

    /* ───── Software ───── */
    { name: 'Office 365 Pro Plus', category: catMap.software, sortOrder: 1, badge: 'sale', variations: [
      { label: '1 Month · Pro Plus', pkg: '1 Month · Pro Plus', price: 499 },
      { label: '3 Months · Pro Plus', pkg: '3 Months · Pro Plus', price: 1199 },
      { label: '6 Months · Pro Plus', pkg: '6 Months · Pro Plus', price: 1999 },
      { label: '12 Months · Pro Plus', pkg: '12 Months · Pro Plus', price: 3499 }
    ]},
    { name: 'IDM Lifetime License', category: catMap.software, sortOrder: 2, variations: [
      { label: '1 PC · Lifetime', pkg: '1 PC · Lifetime', price: 1899 },
      { label: '2 PCs · Lifetime', pkg: '2 PCs · Lifetime', price: 2499 },
      { label: '5 PCs · Lifetime', pkg: '5 PCs · Lifetime', price: 3999 }
    ]},
    { name: 'Truecaller Premium', category: catMap.software, sortOrder: 3, badge: 'sale', variations: [
      { label: 'Lifetime · 1 Number', pkg: 'Lifetime · 1 Number', price: 1599 },
      { label: 'Lifetime · 2 Numbers', pkg: 'Lifetime · 2 Numbers', price: 2499 },
      { label: 'Lifetime · Family (5 Nums)', pkg: 'Lifetime · Family (5)', price: 3999 }
    ]},
    { name: 'Grammarly Premium', category: catMap.software, sortOrder: 4, badge: 'sale', variations: [
      { label: '1 Month · Premium', pkg: '1 Month · Premium', price: 299 },
      { label: '3 Months · Premium', pkg: '3 Months · Premium', price: 749 },
      { label: '6 Months · Premium', pkg: '6 Months · Premium', price: 1199 },
      { label: '12 Months · Premium', pkg: '12 Months · Premium', price: 1999 }
    ]},
    { name: 'Freepik Premium', category: catMap.software, sortOrder: 5, badge: 'sale', variations: [
      { label: '1 Month · Unlimited', pkg: '1 Month · Unlimited', price: 20 },
      { label: '3 Months · Unlimited', pkg: '3 Months · Unlimited', price: 50 },
      { label: '6 Months · Unlimited', pkg: '6 Months · Unlimited', price: 90 },
      { label: '12 Months · Unlimited', pkg: '12 Months · Unlimited', price: 150 }
    ]},
    { name: 'Creative Fabrica', category: catMap.software, sortOrder: 6, variations: [
      { label: '1 Month · Premium', pkg: '1 Month · Premium', price: 699 },
      { label: '3 Months · Premium', pkg: '3 Months · Premium', price: 1699 },
      { label: '12 Months · Premium', pkg: '12 Months · Premium', price: 4999 }
    ]},

    /* ───── Education ───── */
    { name: 'LinkedIn Premium', category: catMap.education, sortOrder: 1, variations: [
      { label: '1 Month · Premium', pkg: '1 Month · Premium', price: 799 },
      { label: '3 Months · Premium', pkg: '3 Months · Premium', price: 1999 },
      { label: '12 Months · Premium', pkg: '12 Months · Premium', price: 5999 }
    ]},
    { name: 'DataCamp', category: catMap.education, sortOrder: 2, variations: [
      { label: '1 Month · Personal', pkg: '1 Month · Personal', price: 699 },
      { label: '3 Months · Personal', pkg: '3 Months · Personal', price: 1799 },
      { label: '12 Months · Personal', pkg: '12 Months · Personal', price: 4999 }
    ]},
    { name: 'Udemy Subscription', category: catMap.education, sortOrder: 3, badge: 'popular', variations: [
      { label: '1 Month · All Courses', pkg: '1 Month · All Courses', price: 799 },
      { label: '3 Months · All Courses', pkg: '3 Months · All Courses', price: 1999 },
      { label: '6 Months · All Courses', pkg: '6 Months · All Courses', price: 3499 },
      { label: '12 Months · All Courses', pkg: '12 Months · All Courses', price: 4999 }
    ]},
    { name: 'Ahrefs', category: catMap.education, sortOrder: 4, badge: 'pro', variations: [
      { label: '1 Month · Lite', pkg: '1 Month · Lite', price: 1499 },
      { label: '3 Months · Lite', pkg: '3 Months · Lite', price: 3999 },
      { label: '6 Months · Lite', pkg: '6 Months · Lite', price: 6999 }
    ]},
    { name: 'Semrush', category: catMap.education, sortOrder: 5, variations: [
      { label: '1 Month · Pro', pkg: '1 Month · Pro', price: 1299 },
      { label: '3 Months · Pro', pkg: '3 Months · Pro', price: 3299 },
      { label: '12 Months · Pro', pkg: '12 Months · Pro', price: 9999 }
    ]},
    { name: 'Ahrefs + Semrush', category: catMap.education, sortOrder: 6, badge: 'best-value', variations: [
      { label: '1 Month · Mega Bundle', pkg: '1 Month · Mega Bundle', price: 2499 },
      { label: '3 Months · Mega Bundle', pkg: '3 Months · Mega Bundle', price: 6499 },
      { label: '6 Months · Mega Bundle', pkg: '6 Months · Mega Bundle', price: 11999 }
    ]},

    /* ───── Gift Cards ───── */
    { name: 'Apple Gift Card $10', category: catMap.gift, sortOrder: 1, variations: [
      { label: 'USA · $10 Value', pkg: '$10 · USA', price: 690 }
    ]},
    { name: 'Apple Gift Card $25', category: catMap.gift, sortOrder: 2, variations: [
      { label: 'USA · $25 Value', pkg: '$25 · USA', price: 1600 }
    ]},
    { name: 'Apple Gift Card $50', category: catMap.gift, sortOrder: 3, variations: [
      { label: 'USA · $50 Value', pkg: '$50 · USA', price: 3200 }
    ]},
    { name: 'Google Play Card $10', category: catMap.gift, sortOrder: 4, variations: [
      { label: 'USA · $10 Value', pkg: '$10 · USA', price: 650 }
    ]},
    { name: 'Steam Wallet $10', category: catMap.gift, sortOrder: 5, variations: [
      { label: 'Global · $10 Value', pkg: '$10 · Global', price: 700 }
    ]},
    { name: 'Netflix Gift Card $25', category: catMap.gift, sortOrder: 6, variations: [
      { label: 'Global · $25 Value', pkg: '$25 · Global', price: 1500 }
    ]}
  ]);

  console.log('Created 40+ products');

  /* ───── Default settings ───── */
  await Settings.insertMany([
    { key: 'wa_number', value: process.env.WA_NUMBER || '880XXXXXXXXX' },
    { key: 'fb_page', value: process.env.FB_PAGE || 'https://web.facebook.com/subdeskofficial' }
  ]);
  console.log('Created default settings');

  /* ───── Setup admin creds (hash for future use) ───── */
  const hash = await bcrypt.hash(process.env.ADMIN_PASS || 'admin123', 10);
  console.log('Admin password hash generated (not stored in DB — uses .env)');

  await mongoose.disconnect();
  console.log('\n✓ Seed complete!');
  console.log('  Admin login: ' + (process.env.ADMIN_USER || 'admin') + ' / ' + (process.env.ADMIN_PASS || 'admin123'));
  console.log('  Start server: npm start\n');
}

seed().catch(e => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
