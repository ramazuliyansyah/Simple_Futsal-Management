const express = require('express');
const router = express.Router();
const Field = require('../models/Field');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Lihat Data Lapangan
router.get('/', async (req, res) => {
  const fields = await Field.find();
  res.render('fields/index', { fields });
});

// Form Tambah Lapangan
router.get('/new', (req, res) => {
  res.render('fields/new');
});

// Tambah Data Lapangan
router.post('/', upload.single('photo'), async (req, res) => {
  const { name, pricePerHour } = req.body;
  const photo = req.file ? req.file.filename : null;
  const newField = new Field({ name, pricePerHour, photo });
  try {
    await newField.save();
    res.redirect('/fields');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Form Edit Lapangan
router.get('/:id/edit', async (req, res) => {
  const field = await Field.findById(req.params.id);
  if (!field) {
    return res.status(404).send('Lapangan tidak ditemukan');
  }
  res.render('fields/edit', { field });
});

// Update Data Lapangan
router.put('/:id', upload.single('photo'), async (req, res) => {
  const { name, pricePerHour } = req.body;
  const photo = req.file ? req.file.filename : null;
  const updates = { name, pricePerHour };
  if (photo) updates.photo = photo;
  try {
    await Field.findByIdAndUpdate(req.params.id, updates);
    res.redirect('/fields');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Hapus Data Lapangan
router.delete('/:id', async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (field && field.photo) {
      // Hapus foto dari folder uploads jika ada
      fs.unlinkSync(path.join(__dirname, '../uploads/', field.photo));
    }
    await Field.findByIdAndDelete(req.params.id);
    res.redirect('/fields');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
