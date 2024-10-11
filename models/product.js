const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Product Schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  featureImage: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,   // Quantity for the product if no variations
    required: false,
    default: 0      // Default quantity is 0 if not specified
  },
  variations: [
    {
      size: {
        type: String,  // Each variation has one size
        required: false
      },
      color: {
        type: String,  // Each variation has one color
        required: false
      },
      quantity: {
        type: Number,  // Quantity available for this variation
        required: false,
        default: 0     // Default quantity is 0 if not specified
      },
      additionalPrice: {
        type: Number,  // Optional price difference for specific variations
        default: 0
      }
    }
  ],
  images: {
    type: [String] // An array of strings (image URLs or paths)
  },
  category: {
    type: [String], // An array of categories
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  reviews: [
    {
      review: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Optional, to restrict the rating between 1 and 5
      }
    }
  ]
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Export Product model
module.exports = mongoose.model('Product', productSchema);
