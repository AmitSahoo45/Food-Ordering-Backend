const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')

const Vendor = require('../model/Vendor');
const { sendOTP } = require('../config/email');

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

        if (Vendorid !== req.userId)
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = await sendOTP(email)

        if (!otp)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });

        res.status(StatusCodes.OK).json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

const UpdateVendorPassword = async (req, res) => {
    try {
        const { newPassword } = req.body

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await Vendor.findByIdAndUpdate(req.userId, { password: hashedPassword }, { new: true })

        res.status(StatusCodes.OK).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

const GetVendor = async (req, res) => {
    const { id } = req.query;

    try {
        const searchedVen = await Vendor.findById(id)
            .populate({
                path: 'menus',
                select: 'foodName foodDescription foodPrice foodImage category restaurant available foodRating'
            })

        if (!searchedVen)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor not found' });

        res.status(StatusCodes.OK).json({ result: searchedVen });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

const ShowVendors = async (req, res) => {
    try {
        const { city, name } = req.query;

        const SearchedVendors = await Vendor.find({ name: { $regex: name, $options: 'i' }, city: { $regex: city, $options: 'i' } });

        if (!SearchedVendors)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor(s) not found' });

        res.status(StatusCodes.OK).json({ result: SearchedVendors });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

const MenuOfVendor = async (req, res) => {
    try {

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    register,
    GetVendor,
    Login,
    ShowVendors,
    forgotPassword,
    UpdateVendorDetails,
    UpdateVendorPassword,
    MenuOfVendor
}
