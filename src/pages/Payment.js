import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaUniversity, FaWallet, FaCheck } from 'react-icons/fa';
import axiosInstance from '../axios';
import '../styles/Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  });

  // Get query params
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get('amount') || '';
  const fundraiserId = queryParams.get('fundraiserId') || '';
  const name = queryParams.get('name') || '';
  const email = queryParams.get('email') || '';
  const phone = queryParams.get('phone') || '';
  const isAnonymous = queryParams.get('isAnonymous') === 'true';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // In a real application, you would integrate with a payment gateway here
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // After payment success, create donation record
      const donationData = {
        fundraiserId,
        amount: parseFloat(amount),
        donor: isAnonymous ? { name: 'Anonymous' } : { name, email, phone },
        paymentMethod,
        status: 'completed'
      };

      // Send donation data to backend
      await axiosInstance.post('/donations', donationData);

      // Update fundraiser with new donation amount
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect to fundraiser page after successful payment
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        navigate(`/fundraiser/${fundraiserId}?donation=success`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, fundraiserId, navigate]);

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <div className="success-icon">
          <FaCheck />
        </div>
        <h2>Thank You for Your Donation!</h2>
        <p>Your payment of ₹{parseFloat(amount).toLocaleString()} has been processed successfully.</p>
        <p>You will be redirected back to the fundraiser page shortly.</p>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Complete Your Donation</h2>
        <div className="donation-summary">
          <div className="donation-amount">
            <span>Donation Amount:</span>
            <span className="amount">₹{parseFloat(amount).toLocaleString()}</span>
          </div>
        </div>

        <div className="payment-methods">
          <div
            className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => handlePaymentMethodChange('card')}
          >
            <FaCreditCard />
            <span>Credit/Debit Card</span>
          </div>
          <div
            className={`payment-method ${paymentMethod === 'netbanking' ? 'active' : ''}`}
            onClick={() => handlePaymentMethodChange('netbanking')}
          >
            <FaUniversity />
            <span>Net Banking</span>
          </div>
          <div
            className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}
            onClick={() => handlePaymentMethodChange('upi')}
          >
            <FaWallet />
            <span>UPI</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          {paymentMethod === 'card' && (
            <>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>
              <div className="form-group">
                <label>Name on Card</label>
                <input
                  type="text"
                  name="cardName"
                  value={paymentDetails.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentDetails.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentDetails.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'upi' && (
            <div className="form-group">
              <label>UPI ID</label>
              <input
                type="text"
                name="upiId"
                value={paymentDetails.upiId}
                onChange={handleChange}
                placeholder="example@upi"
                required
              />
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="bank-selection">
              <p>Select your bank to proceed</p>
              <div className="bank-options">
                <div className="bank-option">SBI</div>
                <div className="bank-option">HDFC</div>
                <div className="bank-option">ICICI</div>
                <div className="bank-option">Axis</div>
                <div className="bank-option">Other Banks</div>
              </div>
            </div>
          )}

          <button type="submit" className="pay-button" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Pay ₹${parseFloat(amount).toLocaleString()}`}
          </button>
        </form>

        <div className="payment-note">
          <p>This is a secure payment, your payment details are encrypted.</p>
        </div>
      </div>
    </div>
  );
};

export default Payment; 