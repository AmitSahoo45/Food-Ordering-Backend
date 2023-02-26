const express = require('express');
const routes = express.Router();

const {
    register,
    Login,
    GetVendor,
    ShowVendors,
    forgotPassword,
    UpdateVendorDetails,
    UpdateVendorPassword,
    MenuOfVendor
} = require('../controllers/Vendor');

const auth = require('../middleware/auth');

routes.post('/register', register);
routes.post('/login', Login);
routes.get('/search', ShowVendors)
routes.get('/:id', GetVendor);
routes.patch('/details/update', auth, UpdateVendorDetails);
routes.get('/forgot-password', auth, forgotPassword)
routes.patch('/password/update', auth, UpdateVendorPassword);
routes.get('/menu/:id', MenuOfVendor);

module.exports = routes;