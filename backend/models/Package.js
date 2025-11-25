const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  userId: String,
  name: String,
  amount: Number,
  startDate: Date,
  endDate: Date,
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Package', PackageSchema);
