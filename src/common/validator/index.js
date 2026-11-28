const { checkSchema } = require("express-validator");

const signUpSchema = checkSchema({
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email address",
    },
    normalizeEmail: true,
  },

  firstname: {
    notEmpty: {
      errorMessage: "First name is required",
    },
    isString: true,
    trim: true,
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: "First name must be between 1 and 100 characters",
    },
  },

  lastname: {
    notEmpty: {
      errorMessage: "Last name is required",
    },
    isString: true,
    trim: true,
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: "Last name must be between 1 and 100 characters",
    },
  },

  password: {
    isLength: {
      options: { min: 8, max: 128 },
      errorMessage: "Password must be between 8 and 128 characters",
    },
  },

  confirmPassword: {
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      },
    },
  },
});

module.exports = { signUpSchema };