import React, { useState } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaCamera, FaSpinner } from 'react-icons/fa';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, currentImage, type = 'profile', className = '' }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a temporary preview
      const tempPreview = URL.createObjectURL(file);
      setPreview(tempPreview);

      // Upload to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${type}/${fileName}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Clean up the temporary preview
      URL.revokeObjectURL(tempPreview);
      
      // Update the preview with the Firebase URL
      setPreview(downloadURL);
      
      // Call the parent component's callback with the Firebase URL
      onImageUpload(downloadURL);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
      // Clean up the temporary preview on error
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setPreview(currentImage || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <div className={`image-preview ${type === 'fundraiser' ? 'fundraiser' : ''}`}>
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <div className="placeholder">
            <FaCamera className="placeholder-icon" />
            <p>No image selected</p>
          </div>
        )}
        {loading && (
          <div className="loading-overlay">
            <FaSpinner className="spinner" />
          </div>
        )}
      </div>
      
      <div className="upload-controls">
        <label className="upload-button">
          {loading ? 'Uploading...' : 'Choose Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
            style={{ display: 'none' }}
          />
        </label>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ImageUpload; 