const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^\d{10}$/, 'Please fill a valid 10 digit phone number'],
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
