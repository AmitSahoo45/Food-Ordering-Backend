const express = require('express');
const routes = express.Router();

const {
    register,
    GetSingleVendor,
    Login,
    searchVendors,
    UpdateVendorDetails,
    UpdateVendorPassword
} = require('../controllers/Vendor');

const auth = require('../middleware/auth');

routes.post('/register', register);
routes.get('/', GetSingleVendor)
routes.post('/login', Login);
routes.patch('/details/update', auth, UpdateVendorDetails);
routes.get('/search', auth, searchVendors);


module.exports = routes;