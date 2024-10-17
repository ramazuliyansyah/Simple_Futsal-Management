const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Tambah Data Member
router.get('/new', (req, res) => {
  res.render('members/new');
});

router.post('/', (req, res) => {
  const { name, age, position, team } = req.body;
  const newMember = new Member({ name, age, position, team });
  newMember.save()
    .then(() => res.redirect('/members'))
    .catch(err => res.status(500).send(err.message));
});

// Lihat Data Member
router.get('/', (req, res) => {
  Member.find()
    .then(members => res.render('members/index', { members }))
    .catch(err => res.status(500).send(err.message));
});

// Edit Data Member
router.get('/:id/edit', (req, res) => {
  Member.findById(req.params.id)
    .then(member => res.render('members/edit', { member }))
    .catch(err => res.status(500).send(err.message));
});

router.put('/:id', (req, res) => {
  const { name, age, position, team } = req.body;
  Member.findByIdAndUpdate(req.params.id, { name, age, position, team })
    .then(() => res.redirect('/members'))
    .catch(err => res.status(500).send(err.message));
});

// Hapus Data Member
router.delete('/:id', (req, res) => {
  Member.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/members'))
    .catch(err => res.status(500).send(err.message));
});

module.exports = router;