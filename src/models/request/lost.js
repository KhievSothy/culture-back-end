const Joi = require('@hapi/joi')

module.exports = {
    // createLost
    0: {
        body: {
            title_kh: Joi.string().required(),
            title_en: Joi.string().required(),
            objecttype_kh: Joi.string().required(),
            objecttype_en: Joi.string().required(),
            period_kh: Joi.string().required(),
            period_en: Joi.string().required(),
            style_kh: Joi.string().required(),
            style_en: Joi.string().required(),
            shape_kh: Joi.string().required(),
            shape_en: Joi.string().required(),
            hight: Joi.number().required(),
            width: Joi.number().required(),
            depth: Joi.number().required(),
            diameter: Joi.number().required(),
            weight: Joi.number().required(),
            desc_kh: Joi.string().required(),
            desc_en: Joi.string().required(),
            provenance_kh: Joi.string().required(),
            provenance_en: Joi.string().required(),
            report_no: Joi.string().required(),
        },
        model: "createLost", // Name of the model
        group: "Lost", // Swagger tag for apis.
        description: "Create Lost and save details in database"
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
        model: "getAllLosts",
        group: 'Lost',
        description: 'Get all Losts'
    },
    2: {
        path: {
            id: Joi.string().required()
        },
        group: "Lost", // Swagger tag for apis.
        description: "Get Lost by Id"
    },
    3: {
        path: {
            id: Joi.string().required()
        },
        group: "Lost", // Swagger tag for apis.
        description: "Delete Lost by Id"
    },
    4: {
        path: {
            id: Joi.string().required()
        },
        body: {
            title_kh: Joi.string().required(),
            title_en: Joi.string().required(),
            objecttype_kh: Joi.string().required(),
            objecttype_en: Joi.string().required(),
            period_kh: Joi.string().required(),
            period_en: Joi.string().required(),
            style_kh: Joi.string().required(),
            style_en: Joi.string().required(),
            shape_kh: Joi.string().required(),
            shape_en: Joi.string().required(),
            hight: Joi.number().required(),
            width: Joi.number().required(),
            depth: Joi.number().required(),
            diameter: Joi.number().required(),
            weight: Joi.number().required(),
            desc_kh: Joi.string().required(),
            desc_en: Joi.string().required(),
            provenance_kh: Joi.string().required(),
            provenance_en: Joi.string().required(),
            report_no: Joi.string().required(),
        },
        model: "updateLost", // Name of the model
        group: "Lost", // Swagger tag for apis.
        description: "Update Lost and save details in database"
    }
}