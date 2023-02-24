const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
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
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: [100, 'Description must be at least 100 characters'],
        maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;