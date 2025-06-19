const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Donation = require("../models/Donation");
const Fundraiser = require("../models/Fundraiser");

// ✅ Register User
const registerUser = async (req, res) => {
  console.log("Register request body:", req.body);
  const { name, email, password, phone } = req.body;
  console.log("Extracted fields:", { name, email, phone: phone || "Not provided" });

  // Basic validation
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ 
      message: "All fields are required",
      missing: {
        name: !name,
        email: !email,
        phone: !phone,
        password: !password
      }
    });
  }

  // Validate phone number format
  if (!/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({ 
      message: "Invalid phone number. It should be 10-15 digits." 
    });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log("Creating user with phone:", phone);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log("Searching for user with email:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("No user found with email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User found, checking password");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log("Password invalid");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Password valid, generating token");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };
    
    console.log("Sending login response:", { token: "***", user: userResponse });

    res.status(200).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Dashboard Data
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    // Get total donations and amount
    const donations = await Donation.find({ donor: userId });
    const totalDonations = donations.length;
    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);

    // Get user's fundraisers
    const fundraisers = await Fundraiser.find({ createdBy: userId })
      .sort({ createdAt: -1 }) // Most recent first
      .select('-__v'); // Exclude version field

    // Get active fundraisers count
    const activeFundraisers = fundraisers.filter(f => f.status === 'active').length;

    // Get saved cards count (placeholder - implement when payment system is added)
    const savedCards = 0;

    res.status(200).json({
      stats: {
        totalDonations,
        totalAmount,
        activeFundraisers,
        savedCards
      },
      fundraisers
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

// Export functions
module.exports = { 
  registerUser, 
  loginUser,
  getDashboardData 
};
