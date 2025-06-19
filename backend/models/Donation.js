const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  fundraiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fundraiser',
    required: true
  },
  donor: {
    name: {
      type: String,
      required: true,
      default: 'Anonymous'
    },
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    }
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Donation amount must be at least 1']
  },
  message: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'netbanking', 'upi', 'wallet'],
    default: 'card'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  taxBenefit: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['completed', 'failed', 'pending'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Add index for faster queries
donationSchema.index({ fundraiser: 1, createdAt: -1 });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
