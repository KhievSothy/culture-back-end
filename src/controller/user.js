
const asyncHandler = require('express-async-handler')
const UserModel = require('../models/user.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createUser = asyncHandler(async (req, res) => {
    const course = new UserModel(req.body)
    const result = await course.save()
    return res.json(result)
})

const getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const course = await UserModel.findById(id)
    return res.json(course)
})

const getUsers = asyncHandler(async (req, res) => {
    // Get all courses 
    const courses = await UserModel.find()
    return res.json(courses)
})

const deleteUserById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await UserModel.deleteOne({ _id: id })
    return res.json(result)
})

const updateUserById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await UserModel.updateOne({ _id: id }, req.body)
    return res.json(result)
})

module.exports = {
    createUser,
    getUserById,
    getUsers,
    deleteUserById,
    updateUserById
}