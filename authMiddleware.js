
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const verifyUser = async (req, res, next) => {

  let authToken;

  // Check if authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

    try {

      // Extract token
      authToken = req.headers.authorization.split(" ")[1];

      // Decode token
      const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

      // Find user in database
      const userData = await UserModel
        .findById(decodedToken.id)
        .select("-password");

      if (!userData) {
        return res.status(401).json({
          message: "Authentication failed: user does not exist"
        });
      }

      // Attach user to request
      req.user = userData;

      next();

    } catch (err) {

      console.log("Token verification error:", err);

      return res.status(401).json({
        message: "Access denied. Invalid token."
      });

    }

  } else {

    return res.status(401).json({
      message: "Access denied. Token missing."
    });

  }

};

module.exports = verifyUser;