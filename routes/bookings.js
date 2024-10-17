const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Field = require('../models/Field');
const bookingController = require('../controllers/bookingController');

router.delete('/bookings/:id', bookingController.deleteBooking);

// Tambah Data Booking
router.get('/new', async (req, res) => {
  try {
    const members = await Member.find();
    const fields = await Field.find();
    res.render('bookings/new', { members, fields });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  const { field, member, date, time, hours } = req.body;
  try {
    const selectedField = await Field.findById(field);
    if (!selectedField) {
      return res.status(404).send('Lapangan tidak ditemukan');
    }

    const totalPrice = selectedField.pricePerHour * hours;

    const newBooking = new Booking({ field, member, date, time, hours, totalPrice });
    await newBooking.save();
    res.redirect('/bookings');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Lihat Data Booking
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('field member');
    bookings.forEach(booking => {
      booking.totalPrice = booking.totalPrice || 0; // Inisialisasi totalPrice jika undefined
    });
    res.render('bookings/index', { bookings });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Edit Data Booking
router.get('/:id/edit', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('field member');
    const members = await Member.find();
    const fields = await Field.find();

    if (!booking || !members || !fields) {
      return res.status(404).send('Data not found');
    }

    booking.totalPrice = booking.totalPrice || 0; // Inisialisasi totalPrice jika undefined

    res.render('bookings/edit', { booking, members, fields });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', async (req, res) => {
  const { field, member, date, time, hours } = req.body;
  try {
    const selectedField = await Field.findById(field);
    if (!selectedField) {
      return res.status(404).send('Lapangan tidak ditemukan');
    }

    const totalPrice = selectedField.pricePerHour * hours;

    await Booking.findByIdAndUpdate(req.params.id, { field, member, date, time, hours, totalPrice });
    res.redirect('/bookings');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Hapus Data Booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect('/bookings');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
