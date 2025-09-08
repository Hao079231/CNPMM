const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { getAllCategories, getCategoryById, createCategory } = require('../controllers/categoryController');
const { getProductsByCategory, getAllProducts, getProductById, createProduct, searchProducts } = require('../controllers/productController');
const auth = require('../middleware/auth');
const publicAuth = require('../middleware/publicAuth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

// Public routes (không cần authentication)
routerAPI.get('/categories', getAllCategories);
routerAPI.get('/categories/:id', getCategoryById);
routerAPI.get('/products', getAllProducts);
routerAPI.get('/products/search', searchProducts);
routerAPI.get('/products/:id', getProductById);
routerAPI.get('/categories/:categoryId/products', getProductsByCategory);
routerAPI.post('/products', createProduct);
// Protected routes (cần authentication)
routerAPI.all('*', auth);

routerAPI.get('/', (req, res) => {
    return res.status(200).json('Hello world api');
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

// Admin routes (cần authentication)
routerAPI.post('/categories', createCategory);

module.exports = routerAPI;