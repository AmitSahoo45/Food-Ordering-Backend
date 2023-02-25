const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true,
        trim: true
    },
    foodDescription: {
        type: String,
        required: true,
        trim: true,
        minLength: [30, 'Description must be at least 30 characters long'],
        maxLength: [200, 'Description must be at most 200 characters long']
    },
    foodPrice: {
        type: Number,
        required: true,
        min: [30, 'Price must be at least 30'],
        max: [1000, 'Price must be at most 1000']
    },
    foodImage: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    foodRating: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

module.exports = mongoose.model('Menu', MenuSchema)
