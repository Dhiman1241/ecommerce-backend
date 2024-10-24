const { default: mongoose } = require('mongoose');
const Product = require('../models/product');

// Get all employees
// Helper function to escape special characters in a string for use in a regular expression
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
}

exports.getAllProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    // Parse offset and limit as integers
    const pageParsed = parseInt(page - 1) * parseInt(limit);

    // Build the query object
    let query = {};

    if (search) {
      // Escape special characters in search term for use in regex
      const escapedSearch = escapeRegExp(search);

      // Check if search is a valid ObjectId
      const isObjectId = mongoose.Types.ObjectId.isValid(search);

      query = {
        $or: [
          isObjectId ? { _id: search } : null,                   // Exact match for _id if it's a valid ObjectId
          { name: { $regex: escapedSearch, $options: 'i' } },    // Case-insensitive partial search in name
          { description: { $regex: escapedSearch, $options: 'i' } }  // Case-insensitive partial search in description
        ].filter(Boolean), // Remove null entries if _id is not valid
      };
    }

    const totalRecords = await Product.countDocuments(query);

    // Fetch the records based on offset and limit
    let products;
    if (limit === "all") {
      // If limit is 'all', Product all matching categories
      products = await Product.find(query);
    } else {
      // Otherwise, apply the limit and pagination
      const limitParsed = parseInt(limit);
      products = await Product.find(query)
        .skip(pageParsed)
        .limit(limitParsed);
    }

    // Return the paginated data and total count
    res.json({
      data: products,
      message: 'Data fetched successfully',
      totalRecords,
      offset: pageParsed,
      limit: limit === "all" ? "all" : parseInt(limit) // Return 'all' if that was the request
    });
  } catch (error) {
    console.log('error ', error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};


// Get an employee by ID
exports.getproductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new employee
exports.createProduct = async (req, res) => {
  const { name, description, featureImage,
    quantity,
    variations,
    images,
    category,
    price } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      featureImage,
      quantity,
      variations,
      images,
      category,
      price
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({product:savedProduct, message:'Product Created Successfully'});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an employee by ID
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an employee by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
