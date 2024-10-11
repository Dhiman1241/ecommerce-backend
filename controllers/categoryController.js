const { default: mongoose } = require('mongoose');
const Category = require('../models/category');

// Get all employees
exports.getAlllCategories = async (req, res) => {
  try {

    const { search, page = 1, limit = 10 } = req.query;

    // Parse offset and limit as integers
    const pageParsed = parseInt(page - 1) * parseInt(limit);

    // Build the query object
    let query = {};

    if (search) {
      // Check if search is a valid ObjectId
      const isObjectId = mongoose.Types.ObjectId.isValid(search);

      query = {
        $or: [
          isObjectId ? { _id: search } : null,                   // Exact match for _id if it's a valid ObjectId
          { name: { $regex: search, $options: 'i' } },           // Case-insensitive partial search in name
          { description: { $regex: search, $options: 'i' } }     // Case-insensitive partial search in description
        ].filter(Boolean), // Remove null entries if _id is not valid
      };
    }

    const totalRecords = await Category.countDocuments(query);

    // Fetch the records based on offset and limit
    let categories;
    if (limit === "all") {
      // If limit is 'all', fetch all matching categories
      categories = await Category.find(query)
    } else {
      // Otherwise, apply the limit and pagination
      const limitParsed = parseInt(limit);
      categories = await Category.find(query)
        .skip(pageParsed)
        .limit(limitParsed);
    }

    // Return the paginated data and total count
    res.json({
      data: categories,
      message: 'Data fetched successfully',
      totalRecords,
      offset: pageParsed,
      limit: limit === "all" ? "all" : parseInt(limit), // Return 'all' if that was the request
    });
  } catch (error) {
    console.log('error ', error)
    res.status(500).json({ message: 'Server error', error: error });
  }
};

// Get an employee by ID
exports.getCategoryById = async (req, res) => {
  try {
    const employee = await Category.findOne({ _id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new employee
exports.createCategory = async (req, res) => {
  const { name, description, } = req.body;

  try {
    const newEmployee = new Category({
      name,
      description,
    });
    const savedCategory = await newEmployee.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an employee by ID
exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an employee by ID
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({ _id: req.params.id });
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).send({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
