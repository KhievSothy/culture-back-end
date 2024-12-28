const Joi = require('@hapi/joi')

module.exports = {
    // createArt
    0: {
        body: {
            title: Joi.string().required(),
            category: Joi.string().required(),
            description: Joi.string().required(),
        },
        model: "createArt", // Name of the model
        group: "Art", // Swagger tag for apis.
        description: "Create Art and save details in database"
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
        model: "getAllArt",
        group: 'Art',
        description: 'Get all Arts'
    },
    2: {
        path: {
            id: Joi.string().required()
        },
        group: "Art", // Swagger tag for apis.
        description: "Get Art by Id"
    },
    3: {
        path: {
            id: Joi.string().required()
        },
        group: "Art", // Swagger tag for apis.
        description: "Delete Art by Id"
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
        model: "updateArt", // Name of the model
        group: "Art", // Swagger tag for apis.
        description: "Update Art and save details in database"
    }
}