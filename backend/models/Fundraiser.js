const mongoose = require('mongoose');

const fundraiserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
  },
  raisedAmount: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['medical', 'education', 'memorial', 'others']
  },
  beneficiary: {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other']
    },
    location: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['individual', 'group'],
      default: 'individual'
    },
    relationship: {
      type: String,
      required: true,
      enum: ['myself', 'family', 'friends', 'others', 'ngo']
    }
  },
  medicalDetails: {
    healthIssue: String,
    hospital: String,
    doctorName: String,
    cityOfTreatment: String
  },
  campaignDetails: {
    duration: {
      type: Number,
      required: true,
      default: 30
    },
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'critical'],
      default: 'normal'
    },
    taxBenefits: {
      type: Boolean,
      default: false
    },
    endDate: {
      type: Date,
      required: false,
      default: function() {
        return new Date(Date.now() + this.duration * 24 * 60 * 60 * 1000);
      }
    }
  },
  creatorDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Pre-save middleware to set campaign end date
fundraiserSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('campaignDetails.duration')) {
    this.campaignDetails.endDate = new Date(
      Date.now() + this.campaignDetails.duration * 24 * 60 * 60 * 1000
    );
  }
  next();
});

module.exports = mongoose.model('Fundraiser', fundraiserSchema);
