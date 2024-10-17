const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect('mongodb://localhost:27017/futsal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  
  const admin = new Admin({ username: 'admin', password: 'password123' });
  admin.save().then(() => {
    console.log('Admin created');
    mongoose.disconnect();
  }).catch(err => {
    console.error('Error creating admin:', err);
    mongoose.disconnect();
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});