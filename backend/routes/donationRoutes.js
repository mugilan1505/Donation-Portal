const express = require('express');
const { makeDonation, getDonationsByFundraiser } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', makeDonation);
router.get('/:fundraiserId', getDonationsByFundraiser);

module.exports = router;
