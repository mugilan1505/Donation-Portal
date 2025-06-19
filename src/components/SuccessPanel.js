import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SuccessPanel = ({ title, message, redirectUrl }) => {
  return (
    <div className="success-panel">
      <FaCheckCircle className="success-icon" />
      <h2 className="success-title">{title}</h2>
      <p className="success-message">{message}</p>
      <p className="success-redirect">You will be redirected shortly...</p>
      
      <div className="success-buttons">
        <Link to={redirectUrl} className="view-fundraiser-btn">
          View Fundraiser
        </Link>
        <Link to="/" className="home-btn">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPanel; 