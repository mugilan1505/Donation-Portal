const Order = require('../models/Donation');
const Fundraiser = require('../models/Fundraiser');

const paymentController = {
  createDonation: async (req, res) => {
    try {
      // Log the request body for debugging
      console.log('Received donation request:', req.body);

      const { 
        fundraiserId, 
        amount, 
        donor, 
        paymentMethod, 
        message, 
        isAnonymous, 
        taxBenefit 
      } = req.body;

      // Basic validation
      if (!fundraiserId) {
        return res.status(400).json({
          success: false,
          message: 'Fundraiser ID is required'
        });
      }

      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid donation amount is required'
        });
      }

      // Check if fundraiser exists
      const fundraiser = await Fundraiser.findById(fundraiserId);
      if (!fundraiser) {
        return res.status(404).json({
          success: false,
          message: 'Fundraiser not found'
        });
      }

      // Prepare donor data
      const donorData = isAnonymous 
        ? { name: 'Anonymous' }
        : {
            name: donor?.name || 'Anonymous',
            email: donor?.email || '',
            phone: donor?.phone || ''
          };

      // Create donation record
      const donation = new Order({
        fundraiser: fundraiserId,
        donor: donorData,
        amount: parseFloat(amount),
        message: message || '',
        paymentMethod: paymentMethod || 'card',
        isAnonymous: isAnonymous || false,
        taxBenefit: taxBenefit || false,
        status: 'completed'
      });

      // Save donation
      const savedDonation = await donation.save();
      console.log('Donation saved:', savedDonation);

      // Update fundraiser raised amount
      const updatedFundraiser = await Fundraiser.findByIdAndUpdate(
        fundraiserId,
        { $inc: { raisedAmount: parseFloat(amount) } },
        { new: true }
      );
      console.log('Fundraiser updated:', updatedFundraiser);

      // Send success response
      res.status(201).json({
        success: true,
        message: 'Donation recorded successfully',
        donation: savedDonation,
        fundraiser: {
          id: updatedFundraiser._id,
          raisedAmount: updatedFundraiser.raisedAmount
        }
      });

    } catch (error) {
      console.error('Error in createDonation:', error);
      
      // Send appropriate error response
      res.status(500).json({
        success: false,
        message: 'Failed to process donation',
        error: error.message
      });
    }
  },

  getDonationStatus: async (req, res) => {
    try {
      const { donationId } = req.params;

      if (!donationId) {
        return res.status(400).json({
          success: false,
          message: 'Donation ID is required'
        });
      }

      const donation = await Order.findById(donationId);
      
      if (!donation) {
        return res.status(404).json({
          success: false,
          message: 'Donation not found'
        });
      }

      res.json({
        success: true,
        status: donation.status,
        donation
      });
    } catch (error) {
      console.error('Error in getDonationStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get donation status',
        error: error.message
      });
    }
  }
};

module.exports = paymentController;
