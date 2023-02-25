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

routes.post('/add', addingDish);
routes.delete('/delete/:id', deletingDish);
routes.patch('/update/:id', updatingDish);
routes.get('/get/:id', gettingDish);
routes.get('/', gettingAllDishes);
routes.patch('/toggle/:id', ToggleFoodAvailability);
routes.get('/filter/cat', getMenuByCategory);

module.exports = routes;