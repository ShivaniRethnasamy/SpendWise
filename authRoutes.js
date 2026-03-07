

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// User registration route
router.post("/signup", authController.signupUser);

// User login route
router.post("/signin", authController.signinUser);

module.exports = router;