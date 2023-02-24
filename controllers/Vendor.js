const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')

const Vendor = require('../model/Vendor');

const register = async (req, res) => {
    const { name, email, phone, address, city, state, password, description } = req.body

    try {
        const oldVendor = await Vendor.findOne({ email });

        if (oldVendor)
            return res.status(StatusCodes.CONFLICT).json({ message: 'Vendor already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newVendor = await Vendor.create({
            name, email, phone, address, city, state, password: hashedPassword, description
        })

        const token = jwt.sign(
            { email: newVendor.email, id: newVendor._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(StatusCodes.OK).json({ result: newVendor, token });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

const GetSingleVendor = async (req, res) => {
    const { search } = req.query;

    try {
        
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    register,
    GetSingleVendor
}
