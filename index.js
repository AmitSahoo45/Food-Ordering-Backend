const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const {
    VendorRouter,
    CustomerRouter,
    MenuRouter,
    OrderRouter
} = require('./routes')

const auth = require('./middleware/auth')

const app = express();

app.use(bodyParser.json({
    limit: '30mb',
    extended: true
}));

app.use(bodyParser.urlencoded({
    limit: '30mb',
    extended: true
}));

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/vendor', VendorRouter)
app.use('/customer', CustomerRouter)
app.use('/menu', MenuRouter)
app.use('/order', auth, OrderRouter)


const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error.message);
    })