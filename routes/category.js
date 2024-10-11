const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route to get all employees
router.get('/', categoryController.getAlllCategories);

// Route to get an employee by ID
router.get('/:id', categoryController.getCategoryById);

// Route to create a new employee
router.post('/', categoryController.createCategory);

// Route to update an employee by ID
router.put('/:id', categoryController.updateCategory);

// Route to delete an employee by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
