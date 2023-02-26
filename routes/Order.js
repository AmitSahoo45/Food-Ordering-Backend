const express = require('express');
const routes = express.Router();

const {
    PlaceOrder,
    getOrderById,
    getOrdersByVendor,
    getOrdersByCustomer,
    updateOrderStatus,
    CancelOrder,
    getLiveOrders,
    ViewIncomingOrders,
    getOrderByStatus
} = require('../controllers/Order')

routes.post('/', PlaceOrder);
routes.get('/:id', getOrderById);
routes.get('/vendor', getOrdersByVendor);
routes.get('/customer', getOrdersByCustomer);
routes.patch('/status/:orderId', updateOrderStatus);
routes.patch('/cancel/:orderId', CancelOrder);
routes.get('/live', getLiveOrders);
routes.get('/incoming', ViewIncomingOrders);
routes.get('/status', getOrderByStatus);

module.exports = routes;