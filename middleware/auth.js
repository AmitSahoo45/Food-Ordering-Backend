const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
require('dotenv').config()

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ message: 'Authentication is required' })

        const token = authHeader.split(' ')[1]
        const isCustomAuth = token.length < 500

        let decodedData

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.JWT_SECRET)

            req.userId = decodedData?.id
        } else {
            console.log(decodedData)
            decodedData = jwt.decode(token)
            req.userId = decodedData?.sub
        }

        next()
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Authentication is required' })
    }
}

module.exports = auth