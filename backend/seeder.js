// backend/seeder.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const products = require('./data/products');

const seed = async () => {
  try {
    await connectDB();
    // 1) Wipe existing
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Cleared Products & Users');

    // 2) Create an admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true
    });
    console.log('Created Admin user:', adminUser.email);

    // 3) Insert products
    const created = await Product.insertMany(products);
    console.log(`Inserted ${created.length} products`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
