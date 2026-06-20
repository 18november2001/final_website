// Run once to create the first admin account
// Usage: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const existing = await Admin.findOne({ email: 'baatile.magopa1@gmail.com' });
  if (existing) {
    console.log('Admin already exists.');
    process.exit(0);
  }

  await Admin.create({
    email: 'baatile.magopa1@gmail.com',
    password: 'ACMIPAdmin2024!',  // ← Change this immediately after first login
    name: 'Baatile'
  });

  console.log('✅ Admin created: baatile.magopa1@gmail.com / ACMIPAdmin2024!');
  console.log('⚠️  Change your password after first login!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
