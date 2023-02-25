const express = require('express');
const routes = express.Router();

const { CustomerRegister, CustomerLogin } = require('../controllers/Customer');

routes.post('/register', CustomerRegister);
routes.post('/login', CustomerLogin);

module.exports = routes;