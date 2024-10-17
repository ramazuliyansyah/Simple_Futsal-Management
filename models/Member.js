const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: String,
  age: Number,
  position: String,
  team: String,
  joinedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);
