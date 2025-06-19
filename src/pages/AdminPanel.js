import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaEye, FaTrash } from 'react-icons/fa';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('fundraisers');
  const [fundraisers, setFundraisers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'fundraisers') {
        const response = await axios.get('/api/admin/fundraisers');
        setFundraisers(response.data);
      } else {
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFundraiser = async (id) => {
    try {
      await axios.put(`/api/admin/fundraisers/${id}/approve`);
      fetchData();
    } catch (error) {
      console.error('Error approving fundraiser:', error);
    }
  };

  const handleRejectFundraiser = async (id) => {
    try {
      await axios.put(`/api/admin/fundraisers/${id}/reject`);
      fetchData();
    } catch (error) {
      console.error('Error rejecting fundraiser:', error);
    }
  };

  const handleDeleteFundraiser = async (id) => {
    if (window.confirm('Are you sure you want to delete this fundraiser?')) {
      try {
        await axios.delete(`/api/admin/fundraisers/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting fundraiser:', error);
      }
    }
  };

  const handleViewFundraiser = (id) => {
    window.open(`/fundraiser/${id}`, '_blank');
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-tabs">
          <button 
            className={activeTab === 'fundraisers' ? 'active' : ''} 
            onClick={() => setActiveTab('fundraisers')}
          >
            Fundraisers
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : activeTab === 'fundraisers' ? (
        <div className="fundraisers-list">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Creator</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fundraisers.map(fundraiser => (
                <tr key={fundraiser._id}>
                  <td>{fundraiser.title}</td>
                  <td>{fundraiser.creator.name}</td>
                  <td>₹{fundraiser.targetAmount}</td>
                  <td>
                    <span className={`status ${fundraiser.status}`}>
                      {fundraiser.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="view-btn"
                      onClick={() => handleViewFundraiser(fundraiser._id)}
                    >
                      <FaEye />
                    </button>
                    {fundraiser.status === 'pending' && (
                      <>
                        <button 
                          className="approve-btn"
                          onClick={() => handleApproveFundraiser(fundraiser._id)}
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleRejectFundraiser(fundraiser._id)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteFundraiser(fundraiser._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="users-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="view-btn">
                      <FaEye />
                    </button>
                    <button className="delete-btn">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 