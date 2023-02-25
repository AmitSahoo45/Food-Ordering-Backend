const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')

const { Customer } = require('../model')

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

        const oldCustomer = await  Customer.findOne({ email })

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

module.exports = {
    CustomerRegister,
    CustomerLogin
}