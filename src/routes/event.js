const express = require('express');
const { createEvent, getEvents, getEventById, deleteEventbyId, updateEventById } = require('../controller/event');
const eventRouter = express.Router();

eventRouter.post('/', createEvent)
eventRouter.get('/', getEvents)
eventRouter.get('/:id', getEventById)
eventRouter.delete('/:id', deleteEventbyId)
eventRouter.put('/:id', updateEventById)

module.exports = eventRouter