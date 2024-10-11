const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Employee Schema
const employeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 18 // Assuming minimum age for employees is 18
  },
  address: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Export Employee model
module.exports = mongoose.model('employee', employeeSchema);
