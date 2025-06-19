require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const createDefaultUser = async () => {
  try {
    // Check if default user already exists
    const existingUser = await User.findById('65f5e3c0e9a45a9876543210');
    
    if (existingUser) {
      console.log('Default user already exists', existingUser);
      return;
    }

    // Create a new user with a specific ID
    const defaultUser = new User({
      _id: '65f5e3c0e9a45a9876543210', // This must match the ID in the controller
      name: 'Default System User',
      email: 'system@crowdfunding.com',
      phone: '1234567890',
      password: 'not-required'
    });

    await defaultUser.save();
    console.log('Default user created successfully!');
  } catch (error) {
    console.error('Error creating default user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createDefaultUser(); 