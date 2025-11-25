const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: String,
  type: String, // deposit / withdraw / package
  method: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
  proof: String
});

module.exports = mongoose.model('Transaction', TransactionSchema);
