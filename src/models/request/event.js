const Joi = require('@hapi/joi')

module.exports = {
    // createEvent
    0: {
        body: {
            title: Joi.string().required(),
            category: Joi.string().required(),
            description: Joi.string().required(),
        },
        model: "createEvent", // Name of the model
        group: "Event", // Swagger tag for apis.
        description: "Create Event and save details in database"
    },
    1: {
        query: {
            limit: Joi.number().optional().default(10).description("Number of items to take"),
            page: Joi.number().optional().default(1),
            sort: Joi.string().optional(),
            query: Joi.string().optional(),
            populate: Joi.string().optional(),
            select: Joi.string().optional()
        },
        model: "getAllEvent",
        group: 'Event',
        description: 'Get all Events'
    },
    2: {
        path: {
            id: Joi.string().required()
        },
        group: "Event", // Swagger tag for apis.
        description: "Get Event by Id"
    },
    3: {
        path: {
            id: Joi.string().required()
        },
        group: "Event", // Swagger tag for apis.
        description: "Delete Event by Id"
    },
    4: {
        path: {
            id: Joi.string().required()
        },
        body: {
            title: Joi.string().optional(),
            category: Joi.string().optional(),
            description: Joi.string().optional(),
        },
        model: "updateEvent", // Name of the model
        group: "Event", // Swagger tag for apis.
        description: "Update Event and save details in database"
    }
}