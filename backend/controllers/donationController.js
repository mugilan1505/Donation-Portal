const Donation = require('../models/Donation');
const Fundraiser = require('../models/Fundraiser');

exports.makeDonation = async (req, res) => {
  try {
    const { fundraiserId, amount, donor, paymentMethod, message, isAnonymous, status } = req.body;

    // Create the donation object
    const donation = new Donation({
      fundraiser: fundraiserId,
      amount,
      donor: isAnonymous ? { name: 'Anonymous' } : donor,
      message: message || '',
      isAnonymous: isAnonymous || false,
      paymentMethod: paymentMethod || 'card',
      status: status || 'completed'
    });

    const savedDonation = await donation.save();

    // Update the fundraiser's raised amount
    await Fundraiser.findByIdAndUpdate(fundraiserId, {
      $inc: { raisedAmount: amount },
      $inc: { supporters: 1 }
    });

    res.status(201).json(savedDonation);
  } catch (error) {
    console.error('Error making donation:', error);
    res.status(400).json({ 
      message: 'Failed to process donation', 
      error: error.message 
    });
  }
};

exports.getDonationsByFundraiser = async (req, res) => {
  try {
    const donations = await Donation.find({ 
      fundraiser: req.params.fundraiserId,
      status: 'completed'
    }).sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    console.error('Error getting donations:', error);
    res.status(400).json({ 
      message: 'Failed to fetch donations', 
      error: error.message 
    });
  }
};
