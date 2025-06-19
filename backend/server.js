require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import route files
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const fundraiserRoutes = require("./routes/fundraiserRoutes");
const donationRoutes = require("./routes/donationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Parse incoming JSON with larger limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Serve static files for images
app.use('/uploads', express.static('uploads'));

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow these origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Route Mounting
app.use("/api/users", userRoutes);           // User login/registration
app.use("/api/contact", contactRoutes);      // Contact form
app.use("/api/fundraisers", fundraiserRoutes); // Fundraiser routes
app.use("/api/donations", donationRoutes);   // Donation routes
app.use("/api/payments", paymentRoutes);     // Payment routes

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
