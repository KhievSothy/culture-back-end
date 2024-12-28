const Joi = require('@hapi/joi')

module.exports = {
    // createSite
    0: {
        body: {
            title_kh: Joi.string().required(),
            title_en: Joi.string().required(),
            desc_kh: Joi.string().required(),
            desc_en: Joi.string().required(),
        },
        model: "createSite", // Name of the model
        group: "Site", // Swagger tag for apis.
        description: "Create Site and save details in database"
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
        model: "getAllSite",
        group: 'Site',
        description: 'Get all Sites'
    },
    2: {
        path: {
            id: Joi.string().required()
        },
        group: "Site", // Swagger tag for apis.
        description: "Get Site by Id"
    },
    3: {
        path: {
            id: Joi.string().required()
        },
        group: "Site", // Swagger tag for apis.
        description: "Delete Site by Id"
    },
    4: {
        path: {
            id: Joi.string().required()
        },
        body: {
            title_kh: Joi.string().required(),
            title_en: Joi.string().required(),
            desc_kh: Joi.string().required(),
            desc_en: Joi.string().required(),
        },
        model: "updateSite", // Name of the model
        group: "Site", // Swagger tag for apis.
        description: "Update Site and save details in database"
    }
}