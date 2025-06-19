const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: function(v) {
        // Must contain only digits and be between 10-15 digits long
        return /^\d{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number. It should be 10-15 digits.`
    },
    trim: true,
    minlength: [10, "Phone number must be at least 10 digits"],
    maxlength: [15, "Phone number must not exceed 15 digits"]
  },
  password: {
    type: String,
    required: false, // ✅ made optional for OTP-only users
  },
});

module.exports = mongoose.model("User", userSchema);
