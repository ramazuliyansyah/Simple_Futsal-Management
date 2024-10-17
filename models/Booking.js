const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  field: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
    required: true
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  hours: {
    type: Number, // Pastikan tipe datanya sesuai
    required: true
  }
});

BookingSchema.pre('remove', async function(next) {
  await this.model('Transaction').deleteMany({ booking: this._id });
  next();
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
