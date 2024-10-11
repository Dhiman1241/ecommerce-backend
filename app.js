const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const Grid = require('gridfs-stream');
require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// MongoDB Connection and GridFS setup
const mongoURI = process.env.MONGO_URI;
const conn = mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err)); // Removed deprecated options




// Import other routes
const employeeRoutes = require('./routes/employee');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

// Use the routes for specific endpoints
app.use('/employee', employeeRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);

// Set the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
