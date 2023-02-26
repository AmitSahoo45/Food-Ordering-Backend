const express = require('express');
const routes = express.Router();

const {
    CustomerRegister,
    CustomerLogin,
    UpdateCustomerDetails,
    getCustomerById, 
    forgotPassword,
    updatePassword
} = require('../controllers/Customer');
const auth = require('../middleware/auth');

routes.post('/register', CustomerRegister);
routes.post('/login', CustomerLogin);
routes.patch('/update', auth, UpdateCustomerDetails);
routes.get('/:id', getCustomerById);
routes.get('/forgot-password', forgotPassword);
routes.patch('/update-password', updatePassword);

module.exports = routes;