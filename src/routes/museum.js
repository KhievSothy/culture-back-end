const express = require('express')
const {
    createMuseum,
    getMuseumById,
    getMuseums,
    deleteMuseumbyId,
    updateMuseumById
} = require('../controller/museum.js');
const museumRouter = express.Router();

museumRouter.post('/', createMuseum)
museumRouter.get('/', getMuseums)
museumRouter.get('/:id', getMuseumById)
museumRouter.delete('/:id', deleteMuseumbyId)
museumRouter.put('/:id', updateMuseumById)

module.exports = museumRouter