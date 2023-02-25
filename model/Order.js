const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    menuItems: [{
        foodItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        }
    }],
    status: {
        type: String,
        enum: ['Placed', 'Accepted', 'Rejected', 'Preparing', 'Ready', 'Cancelled', 'Delivered'],
        default: 'Placed'
    },
    total: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v >= 100;
            },
            message: 'Minimum Order value must be greater than 100'
        }
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;