const Joi = require('@hapi/joi')

module.exports = {
    // createUser
    0: {
        body: {
            firstname: Joi.string().required().default('Sok'),
            lastname: Joi.string().required().default('San'),
            email: Joi.string().required().default('soksan@gmail.com'),
            password: Joi.string().required().default('12345678'),
            confirmPassword: Joi.string().required().default('12345678'),
        },
        model: "signUp", // Name of the model
        group: "Authentication", // Swagger tag for apis.
        description: "Sign up user"
    },
    1: {
        body: {
            email: Joi.string().required().default('soksan@gmail.com'),
            password: Joi.string().required().default('12345678'),
        },
        model: "login", // Name of the model
        group: "Authentication", // Swagger tag for apis.
        description: "Login user"
    },
}