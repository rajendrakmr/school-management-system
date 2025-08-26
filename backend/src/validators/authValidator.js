const { body, validationResult } = require("express-validator");

// ✅ Validation rules
exports.validateSignUp = [
  body("email").trim().notEmpty().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("first_name").notEmpty().isLength({ max: 50 }).withMessage("First name is required"),
  body("last_name").notEmpty().isLength({ max: 50 }).withMessage("Last name is required"),
];

exports.validateLogin = [
  body("email").trim().notEmpty().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

exports.validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword").notEmpty().isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
];

// ✅ Middleware to check validation results
exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return res.status(422).json({ errors: formatted });
  }
  next();
};
