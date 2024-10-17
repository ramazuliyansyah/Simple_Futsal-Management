const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

router.get('/login', (req, res) => {
  res.render('admin/login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('Mencari admin dengan username:', username);
    const admin = await Admin.findOne({ username });
    if (admin) {
      console.log('Admin ditemukan:', admin);
      const isMatch = await admin.comparePassword(password);
      console.log('Password cocok:', isMatch);
      if (isMatch) {
        req.session.adminId = admin._id;
        console.log('Login berhasil, redirect ke dashboard');
        return res.redirect('/admin/dashboard');
      }
    }
    console.log('Login gagal, username atau password salah');
    res.render('admin/login', { error: 'Username atau password salah' });
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.render('admin/login', { error: 'Terjadi kesalahan, silakan coba lagi' });
  }
});

router.get('/dashboard', (req, res) => {
  if (!req.session.adminId) {
    console.log('User belum login, redirect ke login page');
    return res.redirect('/admin/login');
  }
  console.log('User login, menampilkan dashboard');
  res.render('admin/dashboard');
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error saat logout:', err);
      return res.redirect('/admin/dashboard');
    }
    res.clearCookie('connect.sid'); // atau nama cookie sesi Anda
    console.log('Logout berhasil, redirect ke login');
    res.redirect('/admin/login');
  });
});

module.exports = router;
