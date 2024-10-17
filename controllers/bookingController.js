const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await booking.remove();
    res.status(200).json({ message: 'Booking and related transactions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
