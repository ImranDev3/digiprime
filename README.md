# Digital SubDesk

A professional digital product store with admin panel — built with Node.js, Express, MongoDB & EJS.

## Features

- **Public Store** — Browse products by category, search, inline variation expansion, WhatsApp order flow
- **Admin Panel** — Dashboard, product CRUD, category management, settings
- **Dynamic** — All data served from MongoDB, editable via admin panel
- **Responsive** — 2/3/4 column grid, mobile-first design
- **Dark Theme** — Professional slate/indigo design system

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Templating:** EJS
- **Auth:** express-session
- **Frontend:** Vanilla JS, CSS custom properties

## Getting Started

```bash
# 1. Clone & install
git clone <repo-url>
cd digiprime
npm install

# 2. Set up MongoDB (local or Atlas)
#    Update MONGODB_URI in .env

# 3. Configure .env
cp .env.example .env
# Edit: MONGODB_URI, ADMIN_USER, ADMIN_PASS, WA_NUMBER

# 4. Seed the database (populate products & categories)
npm run seed

# 5. Start the server
npm start

# 6. Open in browser
#    Store: http://localhost:3000
#    Admin: http://localhost:3000/admin/login
```

## Project Structure

```
digiprime/
├── server.js              # Express entry point
├── models/                # Mongoose schemas
│   ├── Product.js
│   ├── Category.js
│   └── Settings.js
├── routes/
│   ├── api.js             # Public API (products, categories)
│   └── admin.js           # Admin panel routes
├── middleware/
│   └── auth.js            # Session auth
├── views/
│   ├── index.ejs          # Public store page
│   └── admin/             # Admin panel pages
├── public/                # Static assets (CSS, JS)
├── seed.js                # Database seeder
└── .env                   # Environment config
```
