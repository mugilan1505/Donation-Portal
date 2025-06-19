import axios from 'axios';

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;

export const initializePayment = async (amount, fundraiserId, donor) => {
  try {
    // Get order details from your backend
    const response = await axios.post('/api/payments/create-order', {
      amount,
      fundraiserId,
      donor
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create payment order');
    }

    const { orderId, amount: orderAmount, currency } = response.data;

    const options = {
      key: RAZORPAY_KEY,
      amount: orderAmount,
      currency,
      name: 'TVK Crowdfunding',
      description: 'Donation to Fundraiser',
      order_id: orderId,
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verifyResponse = await axios.post('/api/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            fundraiserId,
            donor
          });

          if (!verifyResponse.data.success) {
            throw new Error(verifyResponse.data.message || 'Payment verification failed');
          }

          return verifyResponse.data;
        } catch (error) {
          console.error('Payment verification failed:', error);
          throw error;
        }
      },
      prefill: {
        name: donor?.name || 'Anonymous',
        email: donor?.email || '',
        contact: donor?.phone || ''
      },
      theme: {
        color: '#982e4b'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    // Handle payment failure
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      throw new Error(response.error.description || 'Payment failed');
    });

  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (orderId) => {
  try {
    const response = await axios.get(`/api/payments/status/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

export const makeDonation = async (donationData) => {
  try {
    // Validate donation data
    if (!donationData) {
      throw new Error('Donation data is required');
    }

    const { fundraiserId, amount, donor } = donationData;

    // Validate required fields
    if (!fundraiserId) {
      throw new Error('Fundraiser ID is required');
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Valid donation amount is required');
    }

    // Validate donor information if not anonymous
    if (!donationData.isAnonymous && (!donor || !donor.name)) {
      throw new Error('Donor name is required for non-anonymous donations');
    }

    console.log('Sending donation request:', donationData);

    const response = await axios.post('/api/payments/donate', donationData);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to process donation');
    }

    console.log('Donation successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Donation failed:', {
      error: error.message,
      donationData
    });

    // Return a user-friendly error message
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to process donation. Please try again.'
    );
  }
};

export const getDonationStatus = async (donationId) => {
  try {
    if (!donationId) {
      throw new Error('Donation ID is required');
    }

    console.log('Checking donation status:', donationId);
    const response = await axios.get(`/api/payments/status/${donationId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get donation status');
    }

    console.log('Donation status retrieved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking donation status:', {
      error: error.message,
      donationId
    });
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to get donation status. Please try again.'
    );
  }
}; 