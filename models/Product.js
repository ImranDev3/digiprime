const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true },
  pkg: { type: String, default: '' }
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  badge: { type: String, default: '' },
  badgeClass: { type: String, default: '' },
  variations: [variationSchema],
  visible: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
