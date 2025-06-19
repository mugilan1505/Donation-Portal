const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new donation
router.post('/donate', paymentController.createDonation);

// Get donation status
router.get('/status/:donationId', paymentController.getDonationStatus);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Payment route error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

module.exports = router;
