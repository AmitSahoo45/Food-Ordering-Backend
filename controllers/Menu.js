const { StatusCodes } = require('http-status-codes')
const { mongoose } = require('mongoose')

const { Vendor, Customer, Menu } = require('../model')

const addingDish = async (req, res) => {
    try {
        const { foodName, foodDescription, foodPrice, foodImage, category } = req.body

        const vendor = await Vendor.findById(req.userId)

        if (!vendor)
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor not found' })

        const dish = await Menu.create({
            foodName,
            foodDescription,
            foodPrice,
            foodImage,
            category,
            restaurant: req.userId
        })

        vendor.menus.push(dish._id)
        await vendor.save()

        res.status(StatusCodes.CREATED).json({ message: 'Dish added successfully', dish })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

const deletingDish = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(StatusCodes.NOT_FOUND).json({ message: '1 - No dish with that id' })

        await Menu.findByIdAndRemove(id)

        const vendor = await Vendor.findById(req.userId)
        vendor.menus = vendor.menus.filter((menuId) => menuId.toString() != id)
        await vendor.save()

        res.status(StatusCodes.OK).json({ message: 'Dish deleted successfully' })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

const updatingDish = async (req, res) => {
    try {
        const { foodName, foodDescription, foodPrice, foodImage, category } = req.body
        const { id } = req.params

        const vendor = await Vendor.findById(req.userId)

        if (!vendor)
            return res.status(StatusCodes.NOT_FOUND).json({ message: '2 - No dish with that id' })

        const updatedDish = await Menu.findByIdAndUpdate(id,
            { foodName, foodDescription, foodPrice, foodImage, category },
            { new: true }
        )

        res.status(StatusCodes.OK).json({ message: 'Dish updated successfully', updatedDish })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

const gettingDish = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(StatusCodes.NOT_FOUND).json({ message: '3 - No dish with that id' })

        const dish = await Menu.findById(id)

        res.status(StatusCodes.OK).json({ message: 'Dish fetched successfully', dish })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

const gettingAllDishes = async (req, res) => {
    try {
        const { VendorId } = req.body
        const dishes = await Menu.find({ restaurant: VendorId })
        res.status(StatusCodes.OK).json({ message: 'Dishes fetched successfully', dishes })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

const ToggleFoodAvailability = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(StatusCodes.NOT_FOUND).json({ message: '4 - No dish with that id' })

        const dish = await Menu.findById(id)

        dish.available = !dish.available

        await dish.save()

        res.status(StatusCodes.OK).json({ message: 'Dish availability toggled successfully', dish })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

const getMenuByCategory = async (req, res) => {
    try {
        const { category } = req.query

        const menu = await Menu.find({ category: { $regex: new RegExp(category, 'i') } })

        res.status(StatusCodes.OK).json({ message: 'Menu fetched successfully', menu })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

module.exports = {
    addingDish,
    deletingDish,
    updatingDish,
    gettingDish,
    gettingAllDishes,
    ToggleFoodAvailability,
    getMenuByCategory
}