const express = require('express')
const {
    createArt,
    getArtById,
    getArts,
    deleteArtbyId,
    updateArtById
} = require('../controller/art.js');
const artRouter = express.Router();

artRouter.post('/', createArt)
artRouter.get('/', getArts)
artRouter.get('/:id', getArtById)
artRouter.delete('/:id', deleteArtbyId)
artRouter.put('/:id', updateArtById)

module.exports = artRouter