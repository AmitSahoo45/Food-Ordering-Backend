const express = require('express');
const routes = express.Router();

const { register, GetSingleVendor } = require('../controllers/Vendor');

routes.post('/register', register);
routes.get('/', GetSingleVendor)

module.exports = routes;