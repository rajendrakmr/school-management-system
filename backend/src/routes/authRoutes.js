 
const express = require("express"); 
const authController = require("../controllers/authController");
// const verifyToken = require("../middleware/verifyToken");

const userController = require('../controllers/userController');
const router = express.Router();
const {
    validateSignUp,
    validateLogin,
    validateChangePassword,
    handleValidation,
} = require("../validators/authValidator");

router.post("/signup", validateSignUp, handleValidation, authController.signup);
router.post("/login", validateLogin, handleValidation, authController.login);
router.post("/refresh", authController.refresh);
// router.post("/change-password", verifyToken, validateChangePassword, handleValidation, authController.changePassword);
router.post('/assign-role', userController.assignRole);

module.exports = router;

module.exports = router;
