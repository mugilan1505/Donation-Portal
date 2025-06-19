const express = require("express");
const { registerUser, loginUser, getDashboardData } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// POST - Register User
router.post("/register", registerUser);

// POST - Login User
router.post("/login", loginUser);

// Protected routes
router.get("/dashboard", protect, getDashboardData);

module.exports = router;
