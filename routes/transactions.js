const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');

// Tambah Data Transaksi
router.get('/new', async (req, res) => {
  const bookings = await Booking.find().populate('field member');
  res.render('transactions/new', { bookings });
});

router.post('/', async (req, res) => {
  const { booking, amount, date, paymentMethod, paymentStatus } = req.body;
  const newTransaction = new Transaction({ booking, amount, date, paymentMethod, paymentStatus });
  newTransaction.save()
    .then(() => res.redirect('/transactions'))
    .catch(err => res.status(500).send(err.message));
});

// Lihat Data Transaksi
router.get('/', (req, res) => {
  Transaction.find().populate({
    path: 'booking',
    populate: { path: 'field member' }
  })
  .then(transactions => res.render('transactions/index', { transactions }))
  .catch(err => res.status(500).send(err.message));
});

module.exports = router;
