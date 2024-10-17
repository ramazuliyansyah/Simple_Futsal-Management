const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
const app = express();

// Koneksi MongoDB
mongoose.connect('mongodb://localhost:27017/futsal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'admin123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Pastikan secure: false untuk pengujian lokal tanpa HTTPS
}));

// Set view engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const adminRoutes = require('./routes/admin');
const memberRoutes = require('./routes/members');
const fieldRoutes = require('./routes/fields');
const bookingRoutes = require('./routes/bookings');
const transactionRoutes = require('./routes/transactions'); // Tambahkan ini

app.use('/admin', adminRoutes);
app.use('/members', memberRoutes);
app.use('/fields', fieldRoutes);
app.use('/bookings', bookingRoutes);
app.use('/transactions', transactionRoutes); // Tambahkan ini

// Route home
app.get('/', (req, res) => {
  res.redirect('/admin/login');
});

// Mulai server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/admin/login`);
});
