const Fundraiser = require('../models/Fundraiser');

exports.createFundraiser = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      goalAmount, 
      category, 
      image,
      beneficiary,
      medicalDetails,
      campaignDetails,
      creatorDetails
    } = req.body;

    // Create a temporary user ID if not authenticated
    const tempUserId = '65f5e3c0e9a45a9876543210'; // This should be a valid ObjectId in your database

    const fundraiser = new Fundraiser({
      title,
      description,
      goalAmount,
      category,
      image,
      beneficiary,
      medicalDetails,
      campaignDetails: {
        ...campaignDetails,
        // Set end date 30 days from now if not provided
        endDate: campaignDetails?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      creatorDetails,
      createdBy: req.user?.id || tempUserId, // Use user ID if available, otherwise use temp ID
      status: 'active'
    });

    const createdFundraiser = await fundraiser.save();
    res.status(201).json(createdFundraiser);
  } catch (error) {
    console.error('Error creating fundraiser:', error);
    res.status(400).json({ 
      message: 'Failed to create fundraiser', 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
};

exports.getAllFundraisers = async (req, res) => {
  const fundraisers = await Fundraiser.find().populate('createdBy', 'name');
  res.json(fundraisers);
};

exports.getFundraiserById = async (req, res) => {
  const fundraiser = await Fundraiser.findById(req.params.id).populate('createdBy', 'name');
  if (fundraiser) res.json(fundraiser);
  else res.status(404).json({ message: 'Fundraiser not found' });
};
