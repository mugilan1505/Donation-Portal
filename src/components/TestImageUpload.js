import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const TestImageUpload = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleImageUpload = (imageUrl) => {
    console.log('Uploaded Image URL:', imageUrl);
    setUploadedImageUrl(imageUrl);
    setUploadError(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Test Image Upload</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Profile Image Upload</h3>
        <ImageUpload
          onImageUpload={handleImageUpload}
          currentImage={uploadedImageUrl}
          type="profile"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Fundraiser Cover Upload</h3>
        <ImageUpload
          onImageUpload={handleImageUpload}
          currentImage={uploadedImageUrl}
          type="fundraiser"
        />
      </div>

      {uploadedImageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Image URL:</h3>
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            wordBreak: 'break-all'
          }}>
            {uploadedImageUrl}
          </div>
          <div style={{ marginTop: '10px' }}>
            <h4>Preview:</h4>
            <img 
              src={uploadedImageUrl} 
              alt="Uploaded" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                borderRadius: '4px'
              }} 
            />
          </div>
        </div>
      )}

      {uploadError && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px'
        }}>
          Error: {uploadError}
        </div>
      )}
    </div>
  );
};

export default TestImageUpload; 