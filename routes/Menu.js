const express = require('express');
const routes = express.Router();

const { addingDish,
    deletingDish,
    updatingDish,
    gettingDish,
    gettingAllDishes,
    ToggleFoodAvailability,
    getMenuByCategory
} = require('../controllers/Menu')

routes.post('/add', auth, addingDish);
routes.delete('/delete/:id', auth, deletingDish);
routes.patch('/update/:id', auth, updatingDish);
routes.get('/get/:id', gettingDish);
routes.get('/', gettingAllDishes);
routes.patch('/toggle/:id', auth, ToggleFoodAvailability);
routes.get('/filter/cat', getMenuByCategory);

module.exports = routes;