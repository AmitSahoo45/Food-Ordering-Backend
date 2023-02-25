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

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const oldVendor = await Vendor.findOne({ email });

        if (!oldVendor)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor not found' });

        const isPasswordCorrect = await bcrypt.compare(password, oldVendor.password);

        if (!isPasswordCorrect)
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { email: oldVendor.email, id: oldVendor._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(StatusCodes.OK).json({ result: oldVendor, token });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

const UpdateVendorDetails = async (req, res) => {
    try {
        const { name, email, phone, address, city, state, description } = req.body;
        const Vendorid = req.userId;

        const oldVendor = await Vendor.findById(req.userId);

        if(Vendorid !== req.userId)
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You are not authorized to change credentials' });

        if (!oldVendor)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor not found' });

        if (email !== oldVendor.email) 
            return res.status(StatusCodes.CONFLICT).json({ message: 'You cannot change your email' });

        const updatedVendor = await Vendor.findByIdAndUpdate(req.userId, {
            name, email, phone, address, city, state, description
        }, { new: true });

        res.status(StatusCodes.OK).json({ result: updatedVendor });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

const UpdateVendorPassword = async (req, res) => {}

const GetSingleVendor = async (req, res) => {
    const { search } = req.query;

    try {
        const SearchedVendor = await Vendor.findById(search);

        if (!SearchedVendor)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor not found' });

        res.status(StatusCodes.OK).json({ result: SearchedVendor });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

const searchVendors = async (req, res) => {
    try {
        const { name } = req.query;
        const { city } = req.body;

        const SearchedVendors = await Vendor.find({ name: { $regex: name, $options: 'i' }, city: { $regex: city, $options: 'i' } });

        if (!SearchedVendors)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor not found' });

        res.status(StatusCodes.OK).json({ result: SearchedVendors });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    register,
    GetSingleVendor,
    Login,
    searchVendors,
    UpdateVendorDetails,
    UpdateVendorPassword
}
