const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Employee Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Export Employee model
module.exports = mongoose.model('category', categorySchema);
