import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/Dashboard.css';
import { FaUser, FaDonate, FaHandHoldingHeart, FaCreditCard, FaEdit, FaTrash, FaClock, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    activeFundraisers: 0,
    savedCards: 0
  });
  const [fundraisers, setFundraisers] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/dashboard');
        setStats(response.data.stats);
        setFundraisers(response.data.fundraisers || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleEditFundraiser = (id) => {
    navigate(`/edit-fundraiser/${id}`);
  };

  const handleDeleteFundraiser = async (id) => {
    if (window.confirm('Are you sure you want to delete this fundraiser?')) {
      try {
        await api.delete(`/fundraisers/${id}`);
        setFundraisers(fundraisers.filter(f => f._id !== id));
        setStats(prev => ({
          ...prev,
          activeFundraisers: prev.activeFundraisers - 1
        }));
      } catch (err) {
        console.error('Error deleting fundraiser:', err);
        alert('Failed to delete fundraiser');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10B981'; // green
      case 'completed':
        return '#3B82F6'; // blue
      case 'draft':
        return '#6B7280'; // gray
      case 'cancelled':
        return '#EF4444'; // red
      default:
        return '#6B7280';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}</h1>
        <p className="dashboard-subtitle">Here's an overview of your account</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaDonate />
          </div>
          <div className="stat-content">
            <h3>Total Donations</h3>
            <p className="stat-value">{stats.totalDonations}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaHandHoldingHeart />
          </div>
          <div className="stat-content">
            <h3>Amount Donated</h3>
            <p className="stat-value">₹{stats.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUser />
          </div>
          <div className="stat-content">
            <h3>Active Fundraisers</h3>
            <p className="stat-value">{stats.activeFundraisers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCreditCard />
          </div>
          <div className="stat-content">
            <h3>Saved Cards</h3>
            <p className="stat-value">{stats.savedCards}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Your Fundraisers</h2>
          <div className="section-content">
            {fundraisers.length > 0 ? (
              <div className="fundraiser-list">
                {fundraisers.map(fundraiser => (
                  <div key={fundraiser._id} className="fundraiser-card">
                    <div className="fundraiser-image">
                      <img src={fundraiser.image} alt={fundraiser.title} />
                      <div 
                        className="fundraiser-status"
                        style={{ backgroundColor: getStatusColor(fundraiser.status) }}
                      >
                        {fundraiser.status.charAt(0).toUpperCase() + fundraiser.status.slice(1)}
                      </div>
                    </div>
                    <div className="fundraiser-details">
                      <h3>{fundraiser.title}</h3>
                      <p className="fundraiser-category">{fundraiser.category}</p>
                      
                      <div className="fundraiser-info">
                        <div className="info-item">
                          <FaMapMarkerAlt />
                          <span>{fundraiser.beneficiary.location}</span>
                        </div>
                        <div className="info-item">
                          <FaCalendarAlt />
                          <span>Ends: {formatDate(fundraiser.campaignDetails.endDate)}</span>
                        </div>
                        <div className="info-item">
                          <FaClock />
                          <span>{fundraiser.campaignDetails.urgency.charAt(0).toUpperCase() + fundraiser.campaignDetails.urgency.slice(1)}</span>
                        </div>
                      </div>

                      <div className="fundraiser-progress">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${(fundraiser.raisedAmount / fundraiser.goalAmount) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="fundraiser-stats">
                        <span>Raised: ₹{fundraiser.raisedAmount.toLocaleString()}</span>
                        <span>Goal: ₹{fundraiser.goalAmount.toLocaleString()}</span>
                        <span className="percentage">
                          {Math.round((fundraiser.raisedAmount / fundraiser.goalAmount) * 100)}%
                        </span>
                      </div>
                      <div className="fundraiser-actions">
                        <button 
                          className="action-btn view"
                          onClick={() => navigate(`/fundraiser/${fundraiser._id}`)}
                        >
                          View Details
                        </button>
                        <button 
                          className="action-btn edit"
                          onClick={() => handleEditFundraiser(fundraiser._id)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeleteFundraiser(fundraiser._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't created any fundraisers yet</p>
                <button 
                  className="primary-button"
                  onClick={() => navigate('/start-fundraiser')}
                >
                  Start a Fundraiser
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Donations</h2>
          <div className="section-content">
            {stats.totalDonations > 0 ? (
              <div className="donation-list">
                {/* Donation list will be populated here */}
                <p>Your recent donations will appear here</p>
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't made any donations yet</p>
                <button 
                  className="primary-button"
                  onClick={() => navigate('/fundraisers')}
                >
                  Browse Fundraisers
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 