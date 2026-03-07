

const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to create authentication token
const createAuthToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// Register New User
// Route: POST /api/auth/register
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password"
      });
    }

    // Check if email already registered
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Account with this email already exists"
      });
    }

    // Encrypt password
    const saltRounds = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await UserModel.create({
      name: name,
      email: email,
      password: encryptedPassword
    });

    res.status(201).json({
      id: newUser._id,
      username: newUser.name,
      email: newUser.email,
      token: createAuthToken(newUser._id)
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Something went wrong while creating the user"
    });
  }
};

// Login Existing User
// Route: POST /api/auth/login
exports.signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password must be provided"
      });
    }

    // Find user in database
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({
        message: "Incorrect email or password"
      });
    }

    // Compare passwords
    const passwordValid = await bcrypt.compare(password, foundUser.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Incorrect email or password"
      });
    }

    res.json({
      id: foundUser._id,
      username: foundUser.name,
      email: foundUser.email,
      token: createAuthToken(foundUser._id)
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Server encountered an error"
    });
  }
};