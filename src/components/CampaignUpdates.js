import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaImage, FaTimes } from 'react-icons/fa';
import '../styles/CampaignUpdates.css';

const CampaignUpdates = ({ fundraiserId, isCreator }) => {
  const [updates, setUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, [fundraiserId]);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get(`/api/fundraisers/${fundraiserId}/updates`);
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.trim() && !selectedImage) return;

    const formData = new FormData();
    formData.append('content', newUpdate);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await axios.post(
        `/api/fundraisers/${fundraiserId}/updates`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUpdates(prev => [response.data, ...prev]);
      setNewUpdate('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Error posting update:', error);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div className="loading">Loading updates...</div>;
  }

  return (
    <div className="campaign-updates">
      <h3>Campaign Updates</h3>
      
      {isCreator && (
        <form onSubmit={handleSubmitUpdate} className="update-form">
          <textarea
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="Share an update about your campaign..."
            rows="3"
          />
          
          <div className="update-actions">
            <div className="image-upload">
              <input
                type="file"
                id="update-image"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <label htmlFor="update-image" className="image-upload-btn">
                <FaImage /> Add Image
              </label>
            </div>
            
            <button type="submit" className="submit-btn">
              <FaPlus /> Post Update
            </button>
          </div>

          {selectedImage && (
            <div className="selected-image">
              <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
              <button type="button" onClick={removeSelectedImage} className="remove-image">
                <FaTimes />
              </button>
            </div>
          )}
        </form>
      )}

      <div className="updates-list">
        {updates.map(update => (
          <div key={update._id} className="update">
            <div className="update-header">
              <span className="update-date">
                {new Date(update.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="update-content">
              {update.content}
            </div>
            {update.image && (
              <div className="update-image">
                <img src={update.image} alt="Update" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignUpdates; 