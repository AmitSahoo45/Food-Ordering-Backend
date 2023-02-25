const { Order, Vendor, Customer, Menu } = require('../model');
const { StatusCodes } = require('http-status-codes')
const { mongoose } = require('mongoose')

const PlaceOrder = async (req, res) => {
    try {
        const { vendorId, menuItems } = req.body;
        const CustomerId = req.userId;

        const customerCred = await Customer.findById(CustomerId);
        const vendorCred = await Vendor.findById(vendorId);

        if (!vendorCred)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Vendor not found" })

        if (!customerCred)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Customer not found" })

        if (vendorCred.orders.length < 10) {
            const newOrder = new Order({
                user: CustomerId,
                vendor: vendorId,
                menuItems,
                status: 'Placed'
            });

            const order = await newOrder.save();

            vendorCred.orders.push(order._id)
            await vendorCred.save()

            return res.status(StatusCodes.CREATED).json({ message: "Order placed successfully", order });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Your order cannot be proceesed. Please try again later." })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong", error });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user id" })

        const order = await Order.findById(orderId);

        if (!order)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" })

        if (order.user == userId || order.vendor == userId)
            return res.status(StatusCodes.OK).json({ order })

        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "You are not authorized to view this order" })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong", error });
    }
}

const getOrdersByVendor = async (req, res) => {
    try {
        const userid = req.userId;

        const { page, limit } = req.query;
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 15,
            populate: {
                path: 'user',
                select: 'name email address phone'
            }
        }

        const orders = await Order.paginate({ vendor: userid }, options);

        return res.status(StatusCodes.OK).json({ orders });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

const getOrdersByCustomer = async (req, res) => {
    try {
        const userid = req.userId;

        const { page, limit } = req.query;
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 15,
            populate: {
                path: 'vendor',
                select: 'name email address phone'
            }
        }

        const orders = await Order.paginate({ user: userid }, options);

        return res.status(StatusCodes.OK).json({ orders });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

const ViewIncomingOrders = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 15,
            populate: {
                path: 'user',
                select: 'name email address phone'
            }
        }

        const orders = await Order.paginate({ vendor: req.userId, status: 'Placed' }, options);

        return res.status(StatusCodes.OK).json({ orders });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const vendorId = req.userId;

        const OrderedFood = await Order.findById(orderId);
        if (!OrderedFood)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" })

        const VendorCred = await Vendor.findById(vendorId);
        if (!VendorCred)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Vendor not found" })

        if (OrderedFood.vendor != vendorId)
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "You are not authorized to update this order" })

        if (status == 'Accepted') {
            OrderedFood.status = 'Accepted';
            await OrderedFood.save();

            VendorCred.orders.push(OrderedFood._id);
            await VendorCred.save();

            return res.status(StatusCodes.OK).json({ message: "Order accepted successfully" });
        } else if (status == 'Rejected') {
            OrderedFood.status = 'Rejected';
            await OrderedFood.save();

            return res.status(StatusCodes.OK).json({ message: "Order rejected successfully" });
        } else if (status == 'Preparing' || status == 'Cooking' || status == 'Ready') {
            OrderedFood.status = status;
            await OrderedFood.save();

            return res.status(StatusCodes.OK).json({ message: "Order status updated successfully" });
        } else if (status == 'Delivered') {
            OrderedFood.status = 'Delivered';
            await OrderedFood.save();

            VendorCred.orders.pull(OrderedFood._id);
            await VendorCred.save();

            return res.status(StatusCodes.OK).json({ message: "Order delivered successfully" });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid status" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

const CancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.userId;

        const selectedOrder = await Order.findById(orderId);

        if (!selectedOrder)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" })

        if (selectedOrder.user != userId)
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "You are not authorized to cancel this order" })

        if (selectedOrder.status == 'Accepted' || selectedOrder.status == 'Preparing') {
            selectedOrder.status = 'Cancelled';
            await selectedOrder.save();

            return res.status(StatusCodes.OK).json({ message: "Order cancelled successfully" });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Order cannot be cancelled" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

const getLiveOrders = async (req, res) => {
    try {
        const vendorId = req.userId;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Vendor not found" })

        const liveOrders = await Order.find({ vendor: vendorId, status: { $in: ['Preparing', 'Accepted', 'Ready'] } });

        return res.status(StatusCodes.OK).json({ liveOrders });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

const getOrderByStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const vendorId = req.userId;

        const statusOrders = await Order.find({ vendor: vendorId, status: status });

        return res.status(StatusCodes.OK).json({ statusOrders });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
}

module.exports = {
    PlaceOrder,
    getOrderById,
    getOrdersByVendor,
    getOrdersByCustomer,
    updateOrderStatus,
    CancelOrder,
    getLiveOrders,
    ViewIncomingOrders,
    getOrderByStatus
}