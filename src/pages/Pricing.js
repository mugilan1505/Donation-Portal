import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pricing.css';

const Pricing = () => {
  const [amount, setAmount] = useState(100000);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [calculatedData, setCalculatedData] = useState({
    gatewayCharges: 0,
    suggestedGoal: 0,
  });

  const navigate = useNavigate();

  const handleCalculate = () => {
    const razorpayBaseFee = amount * 0.02;
    const gst = razorpayBaseFee * 0.18;
    const gatewayCharges = parseFloat((razorpayBaseFee + gst).toFixed(2));
    const suggestedGoal = parseFloat((Number(amount) + gatewayCharges).toFixed(2));

    setCalculatedData({ gatewayCharges, suggestedGoal });
    setShowSuggestion(true);
  };

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Free Fundraising For All</h1>
        <p>0% platform fees for funds raised on TVK</p>
        <div className="cta-container">
          <button className="start-button" onClick={() => navigate('/start-fundraiser')}>
            Start a fundraiser - it's FREE
          </button>
        </div>
      </section>

      {/* Fundraiser Goal Estimator */}
      <section className="goal-estimator">
        <h2>Fundraiser Goal Estimator</h2>
        <p>A simple way to plan and achieve your fundraiser goal</p>

        <div className="estimator-box">
          <label>I want to raise:</label>
          <div className="input-group">
            <span>₹ INR</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <input
            type="range"
            min="1000"
            max="10000000"
            step="1000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="range-slider"
          />
        </div>

        <button className="recalculate-btn" onClick={handleCalculate}>
          calculate
        </button>

        {/* Suggestion Section - Only show after calculate */}
        {showSuggestion && (
          <section className="suggestion-section">
            <div className="suggestion-left">
              <h3>Consider setting a goal of approx.</h3>
              <h1>₹{calculatedData.suggestedGoal.toLocaleString('en-IN')}</h1>
              <p className="disclaimer">
                <em>
                  Disclaimer: This goal is the approximate amount you should consider setting where we assume that you would receive 100% of the raised amount, deducting Razorpay’s 2% + 18% GST.
                </em>
              </p>
            </div>

            <div className="suggestion-right">
              <h4>See breakup</h4>
              <p>Want to raise (₹): <strong>{Number(amount).toLocaleString('en-IN')}</strong></p>
              <p>TVK platform fee (₹): <strong>0</strong></p>
              <p>Payment gateway charges (Razorpay @2% + GST): <strong>₹{calculatedData.gatewayCharges.toLocaleString('en-IN')}</strong></p>
            </div>
          </section>
        )}
      </section>

      {/* Why Choose TVK Section */}
      <section className="why-choose-section">
        <h2>Why choose TVK?</h2>
        <div className="features-grid">
          <div className="feature-box">
            <h4>Dedicated relationship manager</h4>
            <p>Dedicated relationship manager to address all your fundraising needs. Receive help and support anytime, anywhere</p>
          </div>
          <div className="feature-box">
            <h4>Simple setup</h4>
            <p>Set up your fundraiser effortlessly, in 3 simple steps</p>
          </div>
          <div className="feature-box">
            <h4>Smart dashboard</h4>
            <p>Manage all your fundraiser details (withdrawals, donations, receipts and much more) with the interactive dashboard</p>
          </div>
          <div className="feature-box">
            <h4>Easy fund withdrawal</h4>
            <p>Provide all the necessary documents (government ID proof, bank account details etc.), request transfer and withdraw funds safely in a few simple steps</p>
          </div>
          <div className="feature-box">
            <h4>Safety and security</h4>
            <p>The most secure encryption technology to keep your funds safe</p>
          </div>
          <div className="feature-box">
            <h4>24X7 Expert support</h4>
            <p>Expert support at your service, whenever you need</p>
          </div>
          <div className="feature-box">
            <h4>All-in-one mobile app</h4>
            <p>New mobile app to keep your fundraiser needs at your fingertips</p>
          </div>
        </div>
        <div className="start-fundraiser-btn">
          <button className="start-button" onClick={() => navigate('/start-fundraiser')}>
            Start a fundraiser
          </button>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
