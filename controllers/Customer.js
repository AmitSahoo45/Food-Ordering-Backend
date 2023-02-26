const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')

const { Customer } = require('../model');
const { mongoose } = require('mongoose');
const { sendOTP } = require('../config/email');

const CustomerRegister = async (req, res) => {
    const { name, email, phone, address, city, state, password } = req.body

    try {
        const oldCustomer = await Customer.findOne({ email })

        if (oldCustomer)
            return res.status(StatusCodes.CONFLICT).json({ message: 'Customer already exists' })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newCustomer = await Customer.create({
            name, email, phone, address, city, state, password: hashedPassword
        })

        const token = jwt.sign(
            { email: newCustomer.email, id: newCustomer._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(StatusCodes.OK).json({ result: newCustomer, token })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
    }
}

const CustomerLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const oldCustomer = await Customer.findOne({ email })

        if (!oldCustomer)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Customer not found' })

        const isPasswordCorrect = await bcrypt.compare(password, oldCustomer.password)

        if (!isPasswordCorrect)
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' })

        const token = jwt.sign(
            { email: oldCustomer.email, id: oldCustomer._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(StatusCodes.OK).json({ result: oldCustomer, token })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
    }
}

const UpdateCustomerDetails = async (req, res) => {
    try {
        const { name, phone, address, city, state } = req.body

        if (!mongoose.Types.ObjectId.isValid(req.userId))
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Customer not found' })

        const updated = await Customer.findByIdAndUpdate(req.userId, { name, phone, address, city, state })
        res.status(StatusCodes.OK).json({ result: updated })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
    }
}

const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params
        const customer = await Customer.findById(id)
        res.status(StatusCodes.OK).json({ result: customer })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const otp = await sendOTP(email)

        if (!otp)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });

        res.status(StatusCodes.OK).json({ message: 'OTP sent to your email', otp })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await Customer.findByIdAndUpdate(req.userId, { password: hashedPassword }, { new: true })

        res.status(StatusCodes.OK).json({ message: 'Password updated successfully' })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
    }
}

module.exports = {
    CustomerRegister,
    CustomerLogin,
    UpdateCustomerDetails,
    getCustomerById,
    forgotPassword,
    updatePassword
}