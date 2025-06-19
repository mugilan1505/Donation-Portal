import React from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaLink } from 'react-icons/fa';

const SocialShare = ({ url, title, description }) => {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  const handleShare = (platform) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="social-share">
      <h4>Share this fundraiser</h4>
      <div className="share-buttons">
        <button onClick={() => handleShare('facebook')} className="share-btn facebook">
          <FaFacebook /> Facebook
        </button>
        <button onClick={() => handleShare('twitter')} className="share-btn twitter">
          <FaTwitter /> Twitter
        </button>
        <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp">
          <FaWhatsapp /> WhatsApp
        </button>
        <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
          <FaLinkedin /> LinkedIn
        </button>
        <button onClick={copyToClipboard} className="share-btn copy">
          <FaLink /> Copy Link
        </button>
      </div>
    </div>
  );
};

export default SocialShare; 