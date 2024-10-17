const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  photo: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Field', fieldSchema);
