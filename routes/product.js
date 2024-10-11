const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route to get all employees
router.get('/', productController.getAllProducts);

// Route to get an employee by ID
router.get('/:id', productController.getproductById);

// Route to create a new employee
router.post('/', productController.createProduct);

// Route to update an employee by ID
router.put('/:id', productController.updateProduct);

// Route to delete an employee by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
