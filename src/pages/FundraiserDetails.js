import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaHeart, FaShare, FaRegClock, FaUser, FaMapMarkerAlt, 
  FaRupeeSign, FaFacebook, FaTwitter, FaWhatsapp, FaLink,
  FaExclamationCircle, FaRegCalendarAlt, FaRegNewspaper,
  FaEdit, FaUsers, FaDownload, FaQrcode, FaEllipsisH, FaPrint,
  FaFlag, FaEnvelope, FaCopy, FaPencilAlt, FaHeartbeat,
  FaHospital, FaUserMd, FaLock
} from 'react-icons/fa';
import axiosInstance from '../axios';
import '../styles/FundraiserDetails.css';
import { PaymentIcons } from '../utils/payment-icons';
import { PromotionalCards } from '../utils/promotional-cards';
import Comments from '../components/Comments';
import CampaignUpdates from '../components/CampaignUpdates';
import SocialShare from '../components/SocialShare';

// Add inline CSS for error and success messages
const errorMessageStyle = {
  backgroundColor: '#ffebee',
  color: '#d32f2f',
  padding: '10px 15px',
  borderRadius: '4px',
  marginTop: '10px',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  border: '1px solid #ef9a9a'
};

const successMessageStyle = {
  backgroundColor: '#e8f5e9',
  color: '#2e7d32',
  padding: '10px 15px',
  borderRadius: '4px',
  marginTop: '10px',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  border: '1px solid #a5d6a7'
};

// Add these new styles for the donation section
const donationCardStyle = {
  backgroundColor: '#faf9fa',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  padding: '24px',
  marginBottom: '24px',
  position: 'relative',
  overflow: 'hidden',
  maxWidth: '380px'
};

const circularProgressStyle = {
  position: 'relative',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '20px'
};

const donateButtonStyle = {
  backgroundColor: '#982e4b',
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  padding: '14px 30px',
  fontSize: '16px',
  fontWeight: '600',
  width: '100%',
  cursor: 'pointer',
  marginBottom: '12px',
  transition: 'background-color 0.2s ease',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px'
};

const inputContainerStyle = {
  position: 'relative',
  marginBottom: '20px'
};

const currencySymbolStyle = {
  position: 'absolute',
  left: '15px',
  top: '15px',
  fontSize: '18px',
  fontWeight: '500',
  color: '#333'
};

const amountInputStyle = {
  width: '100%',
  padding: '15px 15px 15px 35px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '18px',
  fontWeight: '500',
  boxSizing: 'border-box'
};

const suggestedAmountsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '10px',
  marginBottom: '20px'
};

const amountButtonStyle = (isActive) => ({
  padding: '10px',
  border: isActive ? '2px solid #982e4b' : '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: isActive ? '#fdf1f4' : 'white',
  color: isActive ? '#982e4b' : '#333',
  fontWeight: isActive ? '600' : '400',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
});

const taxBenefitContainerStyle = {
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

// Add this CSS style near the top of the file with other styles
const fundraiserImageContainerStyle = {
  width: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '20px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  backgroundColor: '#f9f9f9'
};

const fundraiserImageStyle = {
  width: '100%',
  display: 'block',
  objectFit: 'cover',
  height: 'auto',
  maxHeight: '450px' // Set a reasonable max height
};

const FundraiserDetails = () => {
  const { id } = useParams();
  const [fundraiser, setFundraiser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [relatedFundraisers, setRelatedFundraisers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrDownloaded, setQrDownloaded] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [taxBenefit, setTaxBenefit] = useState(false);
  const [showTaxInfo, setShowTaxInfo] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [reportErrorMessage, setReportErrorMessage] = useState('');
  const [reportSuccessMessage, setReportSuccessMessage] = useState('');
  const [contactErrorMessage, setContactErrorMessage] = useState('');
  const [contactSuccessMessage, setContactSuccessMessage] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);
  const dropdownRef = useRef(null);
  const qrCodeRef = useRef(null);
  const reportModalRef = useRef(null);
  const contactModalRef = useRef(null);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [donationStep, setDonationStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Predefined donation amounts
  const suggestedAmounts = [1000, 2000, 5000, 10000];

  // Mock updates (in a real app, these would come from the database)
  const updates = [
    {
      id: 1,
      date: '15 May 2023',
      title: 'Treatment Started',
      content: 'We are happy to inform you that the treatment has started. Thank you for your support!'
    },
    {
      id: 2,
      date: '22 May 2023',
      title: 'First round of medication complete',
      content: 'The first round of medication has been completed successfully. The doctors are positive about the progress.'
    }
  ];
  
  // Mock timeline data (to demonstrate the feature)
  const timeline = [
    {
      date: '10 May 2023',
      title: 'Diagnosis',
      description: 'Initial diagnosis and assessment conducted at City Hospital.'
    },
    {
      date: '15 May 2023',
      title: 'Treatment Plan',
      description: 'Doctors finalized the treatment plan which includes 3 phases of therapy.'
    },
    {
      date: '20 May 2023',
      title: 'First Procedure',
      description: 'Successfully completed the first procedure with positive results.'
    }
  ];

  // Add default image
  const defaultImage = 'https://via.placeholder.com/1200x600?text=Support+This+Fundraiser';

  useEffect(() => {
    const fetchFundraiserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/fundraisers/${id}`);
        const data = response.data;
        
        // Check if current user is the creator
        const currentUser = JSON.parse(localStorage.getItem('user'));
        setIsCreator(currentUser && currentUser._id === data.creatorDetails?.id);
        
        // Add timeline data for demonstration purposes
        data.timeline = timeline;
        
        // Ensure medical details has all necessary fields
        if (data.medicalDetails) {
          data.medicalDetails = {
            ...data.medicalDetails,
            // Add estimated cost if not present
            estimatedCost: data.medicalDetails.estimatedCost || data.goalAmount,
            // Add additional info if needed
            additionalInfo: data.medicalDetails.additionalInfo || "This medical case requires urgent attention. The funds will be used for treatment, medication, and post-treatment care."
          };
        }
        
        // IMPORTANT: Handle image URL correctly
        if (data.image) {
          // If image path is relative (doesn't start with http or https), convert to full URL
          if (!data.image.startsWith('http')) {
            // The API URL is "http://localhost:5000/api", but images might be stored outside the api path
            // Adjust the URL construction to point to the correct image location
            const baseServerUrl = 'http://localhost:5000'; // Remove /api for image paths
            data.image = `${baseServerUrl}/${data.image.replace(/^\//, '')}`;
          }
          console.log('Using user-uploaded image:', data.image);
        } else {
          console.warn('No image found for fundraiser, using basic fallback placeholder');
          data.image = 'https://via.placeholder.com/1200x600?text=Support+This+Fundraiser';
        }
        
        setFundraiser(data);
        
        // Also fetch donations for this fundraiser
        const donationsResponse = await axiosInstance.get(`/donations/${id}`);
        setDonations(donationsResponse.data || []);
        
        // Fetch related fundraisers (same category)
        if (data.category) {
          const relatedResponse = await axiosInstance.get(`/fundraisers?category=${data.category}&limit=3&exclude=${id}`);
          const relatedData = relatedResponse.data || [];
          
          // Log related fundraisers data for debugging
          console.log('Related fundraisers data:', relatedData);
          
          // Ensure all related fundraisers have valid images and enrich them if needed
          const enrichedRelatedData = relatedData.map(fundraiser => {
            if (fundraiser.image) {
              // If image path is relative, convert to full URL
              if (!fundraiser.image.startsWith('http')) {
                const baseServerUrl = 'http://localhost:5000'; // Remove /api for image paths
                fundraiser.image = `${baseServerUrl}/${fundraiser.image.replace(/^\//, '')}`;
              }
            } else {
              // Create demo images if needed
              const demoImages = [
                'https://via.placeholder.com/500x280?text=Fundraiser',
                'https://via.placeholder.com/500x280?text=Help+Someone',
                'https://via.placeholder.com/500x280?text=Donate+Now'
              ];
              fundraiser.image = demoImages[Math.floor(Math.random() * demoImages.length)];
            }
            
            return fundraiser;
          });
          
          setRelatedFundraisers(enrichedRelatedData);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching fundraiser details:', err);
        setError('Failed to load fundraiser details. Please try again later.');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFundraiserDetails();
    }
    
    // Check for donation success in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('donation') === 'success') {
      // Show a thank you message using our state-based message system
      setSuccessMessage('Thank you for your donation!');
      
      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }

    // Close modals when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownMenu(false);
      }
      
      if (reportModalRef.current && !reportModalRef.current.contains(event.target)) {
        setShowReportModal(false);
      }
      
      if (contactModalRef.current && !contactModalRef.current.contains(event.target)) {
        setShowContactModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [id]);

  const handleDonation = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setIsDonating(true);
    // Only go to payment method panel, don't submit to backend yet
    setTimeout(() => {
      setIsDonating(false);
      setDonationStep(2);
    }, 500); // Simulate loading
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsDonating(true);
    setTimeout(() => {
      setIsDonating(false);
      setSuccessMessage('Payment successful!');
      // Update the local fundraiser amount for progress bar
      setFundraiser(prev => ({
        ...prev,
        raisedAmount: (prev.raisedAmount || 0) + parseFloat(donationAmount || 0)
      }));
      setDonationStep(1);
      setDonationAmount('');
      setUpiId('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      if (!isAnonymous) {
        setName('');
        setEmail('');
        setPhone('');
      }
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1000); // Simulate payment processing
  };

  const calculateProgress = () => {
    if (!fundraiser) return 0;
    const percentage = (fundraiser.raisedAmount / fundraiser.goalAmount) * 100;
    return Math.min(percentage, 100).toFixed(1); // Cap at 100% and fix to 1 decimal place
  };
  
  const calculateDaysLeft = () => {
    if (!fundraiser || !fundraiser.campaignDetails?.endDate) return 30;
    
    const endDate = new Date(fundraiser.campaignDetails.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
  
  const calculateDaysLeftForCampaign = (endDateStr) => {
    if (!endDateStr) return 30;
    
    const endDate = new Date(endDateStr);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
  
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = fundraiser ? fundraiser.title : 'Help this fundraiser';
    
    let shareUrl;
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        copyToClipboard();
        setShowShareOptions(false);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowShareOptions(false);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const generateQRCode = async () => {
    setGeneratingQR(true);
    setSuccessMessage('');
    
    try {
      // Create a static QR code for fallback in case the API fails
      // Generate a QR code that points to the current URL
      const currentUrl = window.location.href;
      
      // First try to get QR code from the backend API
      try {
        const response = await axiosInstance.get(`/fundraisers/${id}/qrcode`);
        
        // If backend returns QR code data
        if (response.data && response.data.qrCodeUrl) {
          setQrCodeData({
            url: response.data.qrCodeUrl,
            isApiGenerated: true
          });
          setShowQRCode(true);
          setGeneratingQR(false);
          return;
        }
      } catch (apiError) {
        console.warn('API QR code generation failed, using fallback method:', apiError);
        // Continue with fallback method below
      }
      
      // Fallback: Use a public QR code service (for demo purposes)
      // In a real app, you'd want to implement a more robust solution
      const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
      
      // Test if the fallback service is working by loading the image
      const testImage = new Image();
      testImage.onload = () => {
        setQrCodeData({
          url: qrServiceUrl,
          isApiGenerated: false
        });
        setShowQRCode(true);
        setGeneratingQR(false);
      };
      
      testImage.onerror = () => {
        throw new Error('Failed to generate QR code from fallback service');
      };
      
      testImage.src = qrServiceUrl;
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      setSuccessMessage('Failed to generate QR code. Please try again.');
      setGeneratingQR(false);
      setShowQRCode(false);
    }
  };

  const handleDownloadQRCode = () => {
    if (!showQRCode || !qrCodeData) {
      setSuccessMessage('QR code not available yet. Please generate it first.');
      return;
    }
    
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      
      // Use the QR code URL
      link.href = qrCodeData.url;
      link.download = `${fundraiser.title.replace(/\s+/g, '-').toLowerCase()}-donate-qr.png`;
      
      // For cross-origin images, we can open in a new tab instead
      if (!qrCodeData.isApiGenerated) {
        window.open(qrCodeData.url, '_blank');
        setSuccessMessage('QR code opened in a new tab. Right-click to save it.');
      } else {
        // For same-origin images we can download directly
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSuccessMessage('QR code downloaded successfully!');
      }
      
      setQrDownloaded(true);
      
      // Reset the downloaded state after 3 seconds
      setTimeout(() => {
        setQrDownloaded(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setSuccessMessage('Failed to download QR code. Please try again.');
    }
  };

  const handleMenuOption = (option) => {
    setShowDropdownMenu(false);
    
    switch(option) {
      case 'dashboard':
        // Navigate to campaign dashboard
        window.location.href = `/dashboard/${id}`;
        break;
      case 'settings':
        // Navigate to campaign settings
        window.location.href = `/settings/${id}`;
        break;
      case 'team':
        // Navigate to team members page
        window.location.href = `/team/${id}`;
        break;
      default:
        console.log(`Selected menu option: ${option}`);
    }
  };

  const handlePrint = (cardType) => {
    const printContent = cardType === 'facebook' 
      ? PromotionalCards.facebookCard
      : PromotionalCards.printableCard;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Promotional Material</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; }
            .print-container { max-width: 100%; }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent}
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const reportFundraiser = async (e) => {
    e.preventDefault();
    if (!reportReason) {
      setReportErrorMessage('Please select a reason for reporting');
      return;
    }
    
    try {
      // Clear previous error messages
      setReportErrorMessage('');
      
      const reportData = {
        fundraiserId: id,
        reason: reportReason,
        description: reportDescription,
        reporterEmail: email || 'anonymous@example.com'
      };
      
      // Send report data to backend
      await axiosInstance.post('/reports', reportData);
      
      setReportSuccessMessage('Thank you for your report. Our team will review it shortly.');
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        // Reset and close modal
        setReportReason('');
        setReportDescription('');
        setReportSuccessMessage('');
        setShowReportModal(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting report:', err);
      setReportErrorMessage('Failed to submit report. Please try again.');
    }
  };
  
  const contactOrganizer = async (e) => {
    e.preventDefault();
    if (!contactMessage || !contactName || !contactEmail) {
      setContactErrorMessage('Please fill in all required fields');
      return;
    }
    
    try {
      // Clear previous error messages
      setContactErrorMessage('');
      
      const contactData = {
        fundraiserId: id,
        message: contactMessage,
        name: contactName,
        email: contactEmail,
        organizerId: fundraiser.creatorDetails?.id
      };
      
      // Send contact data to backend
      await axiosInstance.post('/messages', contactData);
      
      setContactSuccessMessage('Your message has been sent to the organizer.');
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        // Reset and close modal
        setContactMessage('');
        setContactName('');
        setContactEmail('');
        setContactSuccessMessage('');
        setShowContactModal(false);
      }, 3000);
    } catch (err) {
      console.error('Error sending message:', err);
      setContactErrorMessage('Failed to send message. Please try again.');
    }
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        setSuccessMessage('Failed to copy link. Please try again.');
      });
  };

  const updateTaxBenefit = (e) => {
    setTaxBenefit(e.target.checked);
  };
  
  const toggleTaxInfo = () => {
    setShowTaxInfo(!showTaxInfo);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading fundraiser details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Link to="/" className="back-link">Go back to home</Link>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div className="error-container">
        <p className="error-message">Fundraiser not found</p>
        <Link to="/" className="back-link">Go back to home</Link>
      </div>
    );
  }

  const topDonors = donations
    .filter(d => !d.isAnonymous)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="fundraiser-details-page">
      <div className="fundraiser-management-bar">
        <Link to="/withdraw" className="withdraw-link">Withdraw funds</Link>
        <div className="campaign-menu-container" ref={dropdownRef}>
          <button 
            className="more-btn" 
            onClick={() => setShowDropdownMenu(!showDropdownMenu)}
          >
            More <FaEllipsisH />
          </button>
          
          {showDropdownMenu && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => handleMenuOption('dashboard')}>
                Campaign dashboard
              </button>
              <button className="dropdown-item" onClick={() => handleMenuOption('settings')}>
                Edit settings
              </button>
              <button className="dropdown-item" onClick={() => handleMenuOption('team')}>
                Add team members
              </button>
              <button className="dropdown-item" onClick={() => setShowContactModal(true)}>
                Contact organizer
              </button>
              <button className="dropdown-item" onClick={() => setShowReportModal(true)}>
                Report fundraiser
              </button>
            </div>
          )}
        </div>
        <div className="days-remaining">
          <span>{calculateDaysLeft()} days to go <FaPencilAlt size={12} /></span>
        </div>
      </div>

      <div className="fundraiser-content">
        <div className="fundraiser-main">
          <h1 className="fundraiser-title" style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#333',
            lineHeight: '1.2'
          }}>{fundraiser.title}</h1>
          
          <div style={{
            width: '100%',
            marginBottom: '24px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#f5f5f5',
            position: 'relative',
            paddingTop: '56.25%' // 16:9 aspect ratio
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {imageLoading && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  zIndex: 1
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid #982e4b',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 10px'
                  }}></div>
                  <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Loading image...</p>
                  <style>
                    {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                  </style>
                </div>
              )}
              <img
                src={fundraiser.image || defaultImage}
                alt={fundraiser.title}
                onLoad={() => {
                  setImageLoading(false);
                  setImageError(false);
                }}
                onError={(e) => {
                  console.error('Error loading image:', e);
                  setImageLoading(false);
                  setImageError(true);
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = defaultImage;
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  opacity: imageLoading ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              />
              {imageError && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#666',
                  zIndex: 1
                }}>
                  <FaExclamationCircle style={{ fontSize: '24px', color: '#dc3545', marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontSize: '14px' }}>Failed to load image</p>
                </div>
              )}
            </div>
          </div>

          <div className="share-buttons-container">
            <a href="#" className="whatsapp-share-btn" onClick={(e) => { e.preventDefault(); handleShare('whatsapp'); }}>
              <FaWhatsapp /> Share
            </a>
            <a href="#" className="facebook-share-btn" onClick={(e) => { e.preventDefault(); handleShare('facebook'); }}>
              <FaFacebook /> Share
            </a>
            <button className="copy-link-btn" onClick={copyToClipboard}>
              <FaCopy /> {copySuccess ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          <div className="fundraiser-creator-section">
            <div className="creator-beneficiary-container">
              <div className="creator-info">
                <div className="creator-avatar">
                  <FaUser />
                </div>
                <div className="creator-details">
                  <p>Created by</p>
                  <h3>{fundraiser.creatorDetails?.name || "Mugilan R"}</h3>
                </div>
              </div>
              <div className="beneficiary-info">
                <div className="beneficiary-avatar">
                  <span>M</span>
                </div>
                <div className="beneficiary-details">
                  <p>This fundraiser will benefit</p>
                  <h3>{fundraiser.beneficiary?.name || "Mugilan"}</h3>
                  <p className="beneficiary-location">
                    from {fundraiser.beneficiary?.location || "Coimbatore, Tamil Nadu"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="content-tabs">
            <button 
              className={`tab-button ${activeTab === 'story' ? 'active' : ''}`}
              onClick={() => setActiveTab('story')}
            >
              Story
            </button>
            <button 
              className={`tab-button ${activeTab === 'updates' ? 'active' : ''}`}
              onClick={() => setActiveTab('updates')}
            >
              Updates ({updates.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'donors' ? 'active' : ''}`}
              onClick={() => setActiveTab('donors')}
            >
              Donors ({donations.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'story' && (
              <>
                <div className="fundraiser-story-wrapper">
                  <div className="fundraiser-story-header">
                    <h3 className="section-title">About the fundraiser</h3>
                    <div className="section-divider"></div>
                  </div>
                  <div className="fundraiser-story-content">
                    {fundraiser.description}
                  </div>
                </div>

                {fundraiser.medicalDetails && (
                  <div className="medical-section">
                    <div className="medical-section-header">
                      <h3 className="section-title">Medical Details</h3>
                      <div className="section-divider"></div>
                    </div>
                    
                    <div className="medical-cards-container">
                      <div className="medical-card">
                        <div className="medical-card-icon health-icon">
                          <FaHeartbeat />
                        </div>
                        <div className="medical-card-content">
                          <h4 className="medical-card-title">Health Issue</h4>
                          <p className="medical-card-value">{fundraiser.medicalDetails.healthIssue}</p>
                        </div>
                      </div>
                      
                      {fundraiser.medicalDetails.hospital && (
                        <div className="medical-card">
                          <div className="medical-card-icon hospital-icon">
                            <FaHospital />
                          </div>
                          <div className="medical-card-content">
                            <h4 className="medical-card-title">Hospital</h4>
                            <p className="medical-card-value">{fundraiser.medicalDetails.hospital}</p>
                          </div>
                        </div>
                      )}
                      
                      {fundraiser.medicalDetails.doctorName && (
                        <div className="medical-card">
                          <div className="medical-card-icon doctor-icon">
                            <FaUserMd />
                          </div>
                          <div className="medical-card-content">
                            <h4 className="medical-card-title">Doctor</h4>
                            <p className="medical-card-value">{fundraiser.medicalDetails.doctorName}</p>
                          </div>
                        </div>
                      )}
                      
                      {fundraiser.medicalDetails.cityOfTreatment && (
                        <div className="medical-card">
                          <div className="medical-card-icon location-icon">
                            <FaMapMarkerAlt />
                          </div>
                          <div className="medical-card-content">
                            <h4 className="medical-card-title">City of Treatment</h4>
                            <p className="medical-card-value">{fundraiser.medicalDetails.cityOfTreatment}</p>
                          </div>
                        </div>
                      )}
                      
                      {fundraiser.medicalDetails.estimatedCost && (
                        <div className="medical-card">
                          <div className="medical-card-icon cost-icon">
                            <FaRupeeSign />
                          </div>
                          <div className="medical-card-content">
                            <h4 className="medical-card-title">Estimated Cost</h4>
                            <p className="medical-card-value">₹{fundraiser.medicalDetails.estimatedCost.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {fundraiser.medicalDetails.additionalInfo && (
                      <div className="medical-additional-info">
                        <h4>Additional Information</h4>
                        <p>{fundraiser.medicalDetails.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {fundraiser.timeline && fundraiser.timeline.length > 0 && (
                  <div className="timeline-section">
                    <div className="timeline-section-header">
                      <h3 className="section-title">Treatment Timeline</h3>
                      <div className="section-divider"></div>
                    </div>
                    <div className="timeline-container">
                      {[...fundraiser.timeline]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((event, index) => (
                          <div className="timeline-item" key={index}>
                            <div className="timeline-point"></div>
                            <div className="timeline-content">
                              <div className="timeline-date">{event.date}</div>
                              <h4 className="timeline-title">{event.title}</h4>
                              <p className="timeline-description">{event.description}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'updates' && (
              <div className="updates-section">
                {updates.length > 0 ? (
                  updates.map(update => (
                    <div className="update-card" key={update.id}>
                      <div className="update-header">
                        <FaRegNewspaper className="update-icon" />
                        <div>
                          <h3>{update.title}</h3>
                          <p className="update-date">{update.date}</p>
                        </div>
                      </div>
                      <div className="update-content">
                        <p>{update.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <p>No updates have been posted yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'donors' && (
              <div className="donors-section">
                {donations.length > 0 ? (
                  donations.map((donation, index) => (
                    <div className="donor-card" key={index}>
                      <div className="donor-info">
                        <div className="donor-name">
                          <FaUser className="donor-icon" />
                          <h4>{donation.isAnonymous ? 'Anonymous' : donation.donor.name}</h4>
                        </div>
                        <div className="donor-date">
                          {donation.createdAt ? formatDate(donation.createdAt) : 'Recent donation'}
                        </div>
                      </div>
                      <div className="donation-amount">
                        ₹{donation.amount.toLocaleString()}
                      </div>
                      {donation.message && (
                        <div className="donation-message">
                          "{donation.message}"
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <p>Be the first one to donate to this fundraiser.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="promotional-tools-section">
            <h2>Promotional tools</h2>
            <div className="promotional-tools-divider">
              <span className="divider-icon"></span>
            </div>
            <p className="promotional-tools-desc">
              These are custom-made tools to help you promote your campaign.
            </p>
            <div className="promotional-tools-cards">
              <div className="promotional-tool-card">
                <div className="promotional-tool-image" dangerouslySetInnerHTML={{ __html: PromotionalCards.facebookCard }}></div>
                <p className="promotional-tool-text">Upload it as your Facebook cover</p>
                <button className="promotion-download-btn" onClick={() => handlePrint('facebook')}>
                  <FaPrint /> Print
                </button>
              </div>
              <div className="promotional-tool-card">
                <div className="promotional-tool-image" dangerouslySetInnerHTML={{ __html: PromotionalCards.printableCard }}></div>
                <p className="promotional-tool-text">Print and share it in public spaces like offices</p>
                <button className="promotion-download-btn" onClick={() => handlePrint('printable')}>
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          </div>

          {relatedFundraisers.length > 0 && (
            <section className="similar-fundraisers-section" style={{ marginTop: 40, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, alignSelf: 'flex-start' }}>Similar Fundraisers</h2>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 32,
                justifyContent: 'center',
                width: '100%',
                maxWidth: 1200,
                margin: '0 auto'
              }}>
                {relatedFundraisers.map((related, index) => {
                  const percentRaised = Math.min(Math.round((related.raisedAmount / related.goalAmount) * 100), 100);
                  return (
                    <div key={index} style={{
                      background: '#fff',
                      borderRadius: 20,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                      width: 370,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      overflow: 'hidden',
                      marginBottom: 24
                    }}>
                      <div style={{ width: '100%', height: 210, overflow: 'hidden' }}>
                        <img
                          src={related.image}
                          alt={related.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                      <div style={{ padding: '24px 24px 0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 12px 0', textAlign: 'left', color: '#222' }}>{related.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 600, color: '#27ae60', fontSize: 16 }}>{percentRaised}%</span>
                            <span style={{ color: '#888', fontSize: 14 }}>Raised</span>
                            <span style={{ color: '#27ae60', fontWeight: 600, marginLeft: 8 }}>₹{related.raisedAmount.toLocaleString()}</span>
                          </div>
                          <span style={{ flex: 1 }}></span>
                          <span style={{ color: '#888', fontSize: 14 }}>Created by</span>
                          <span style={{ fontWeight: 500, marginLeft: 6 }}>{related.creatorDetails?.name || 'Unknown'}</span>
                        </div>
                        <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
                          <div style={{ width: `${percentRaised}%`, height: '100%', background: '#27ae60', borderRadius: 4, transition: 'width 0.3s' }}></div>
                        </div>
                      </div>
                      <div style={{ padding: 24, paddingTop: 0 }}>
                        <a href={`/fundraiser/${related._id}`} style={{
                          display: 'block',
                          width: '100%',
                          background: '#982e4b',
                          color: '#fff',
                          textAlign: 'center',
                          borderRadius: 30,
                          padding: '14px 0',
                          fontWeight: 600,
                          fontSize: 18,
                          textDecoration: 'none',
                          marginTop: 8
                        }}>
                          View & Donate
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="social-features">
          <SocialShare 
            url={window.location.href}
            title={fundraiser.title}
            description={fundraiser.description}
          />
          
          <CampaignUpdates 
            fundraiserId={fundraiser._id}
            isCreator={isCreator}
          />
          
          <Comments fundraiserId={fundraiser._id} />
        </div>

        <div className="donation-sidebar">
          {donationStep === 1 && (
            <form onSubmit={handleDonation} className="donation-card" style={{
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              padding: 32,
              marginBottom: 32,
              maxWidth: 400,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 18
            }}>
              <div style={{ position: 'relative', marginBottom: 18 }}>
                <span style={{
                  position: 'absolute',
                  left: 18,
                  top: 18,
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#982e4b',
                  zIndex: 2
                }}>₹</span>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 40px',
                    borderRadius: 12,
                    border: '1.5px solid #eee',
                    fontSize: 18,
                    fontWeight: 500,
                    boxSizing: 'border-box',
                    outline: 'none',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    transition: 'border 0.2s',
                    marginBottom: 0
                  }}
                  min="1"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 10 }}>
                {suggestedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    style={{
                      padding: '12px 0',
                      border: donationAmount === amount.toString() ? '2px solid #982e4b' : '1.5px solid #eee',
                      borderRadius: 10,
                      background: donationAmount === amount.toString() ? '#fdf1f4' : '#fafafa',
                      color: donationAmount === amount.toString() ? '#982e4b' : '#333',
                      fontWeight: donationAmount === amount.toString() ? 700 : 500,
                      fontSize: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setDonationAmount(amount.toString())}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>
              <div style={{
                background: '#f9f9f9',
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <input
                  type="checkbox"
                  id="taxBenefit"
                  checked={taxBenefit}
                  onChange={updateTaxBenefit}
                  style={{ margin: 0 }}
                />
                <label htmlFor="taxBenefit" style={{ fontSize: 15, color: '#333', margin: 0 }}>
                  I want to claim tax benefit on my donation
                </label>
              </div>
              {!isAnonymous ? (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 10,
                      border: '1.5px solid #eee',
                      fontSize: 15,
                      marginBottom: 10,
                      boxSizing: 'border-box',
                      outline: 'none',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                    required
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 10,
                      border: '1.5px solid #eee',
                      fontSize: 15,
                      marginBottom: 10,
                      boxSizing: 'border-box',
                      outline: 'none',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                    required
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile Number"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 10,
                      border: '1.5px solid #eee',
                      fontSize: 15,
                      marginBottom: 10,
                      boxSizing: 'border-box',
                      outline: 'none',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                    required
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      id="anonymousDonation"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <label htmlFor="anonymousDonation" style={{ fontSize: 15, color: '#666' }}>
                      Make this an anonymous donation
                    </label>
                  </div>
                </>
              ) : (
                <div style={{
                  marginBottom: 10,
                  padding: 15,
                  background: '#f5f5f5',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FaLock size={16} style={{ color: '#888' }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                        Anonymous Donation
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
                        Your details will not be shown publicly
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(false)}
                    style={{ background: 'transparent', border: 'none', color: '#982e4b', cursor: 'pointer', fontSize: 15, fontWeight: 600 }}
                  >
                    Change
                  </button>
                </div>
              )}
              {successMessage && (
                <div className="success-message-container" style={{
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  padding: '12px 18px',
                  borderRadius: 8,
                  marginTop: 8,
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 15,
                  border: '1px solid #a5d6a7'
                }}>
                  <FaHeart /> {successMessage}
                </div>
              )}
              <button type="submit" style={{
                background: '#982e4b',
                color: 'white',
                border: 'none',
                borderRadius: 30,
                padding: '16px 0',
                fontSize: 18,
                fontWeight: 700,
                width: '100%',
                cursor: isDonating ? 'not-allowed' : 'pointer',
                marginTop: 8,
                boxShadow: '0 2px 8px rgba(152,46,75,0.08)',
                transition: 'background 0.2s'
              }} disabled={isDonating}>
                {isDonating ? 'Processing...' : 'Donate now'}
              </button>
            </form>
          )}
          {donationStep === 2 && (
            <form onSubmit={handlePayment} className="donation-card" style={{
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              padding: 32,
              marginBottom: 32,
              maxWidth: 400,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 18
            }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Select Payment Method</h3>
              <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                <button type="button" onClick={() => setSelectedPaymentMethod('upi')} style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 10,
                  border: selectedPaymentMethod === 'upi' ? '2px solid #982e4b' : '1.5px solid #eee',
                  background: selectedPaymentMethod === 'upi' ? '#fdf1f4' : '#fafafa',
                  color: selectedPaymentMethod === 'upi' ? '#982e4b' : '#333',
                  fontWeight: selectedPaymentMethod === 'upi' ? 700 : 500,
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>UPI</button>
                <button type="button" onClick={() => setSelectedPaymentMethod('card')} style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 10,
                  border: selectedPaymentMethod === 'card' ? '2px solid #982e4b' : '1.5px solid #eee',
                  background: selectedPaymentMethod === 'card' ? '#fdf1f4' : '#fafafa',
                  color: selectedPaymentMethod === 'card' ? '#982e4b' : '#333',
                  fontWeight: selectedPaymentMethod === 'card' ? 700 : 500,
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>Card</button>
              </div>
              {selectedPaymentMethod === 'upi' && (
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: '1.5px solid #eee',
                    fontSize: 15,
                    marginBottom: 10,
                    boxSizing: 'border-box',
                    outline: 'none',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                  }}
                  required
                />
              )}
              {selectedPaymentMethod === 'card' && (
                <>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 10,
                      border: '1.5px solid #eee',
                      fontSize: 15,
                      marginBottom: 10,
                      boxSizing: 'border-box',
                      outline: 'none',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                    required
                  />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: 10,
                        border: '1.5px solid #eee',
                        fontSize: 15,
                        marginBottom: 10,
                        boxSizing: 'border-box',
                        outline: 'none',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                      }}
                      required
                    />
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      placeholder="CVV"
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: 10,
                        border: '1.5px solid #eee',
                        fontSize: 15,
                        marginBottom: 10,
                        boxSizing: 'border-box',
                        outline: 'none',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                      }}
                      required
                    />
                  </div>
                </>
              )}
              <button type="submit" style={{
                background: '#982e4b',
                color: 'white',
                border: 'none',
                borderRadius: 30,
                padding: '16px 0',
                fontSize: 18,
                fontWeight: 700,
                width: '100%',
                cursor: isDonating ? 'not-allowed' : 'pointer',
                marginTop: 8,
                boxShadow: '0 2px 8px rgba(152,46,75,0.08)',
                transition: 'background 0.2s'
              }} disabled={isDonating}>
                {isDonating ? 'Processing...' : 'Pay'}
              </button>
              <button type="button" onClick={() => setDonationStep(1)} style={{
                background: 'transparent',
                color: '#982e4b',
                border: 'none',
                borderRadius: 30,
                padding: '10px 0',
                fontSize: 16,
                fontWeight: 600,
                width: '100%',
                marginTop: 0,
                textDecoration: 'underline',
                cursor: 'pointer'
              }}>Back</button>
            </form>
          )}
          
          {topDonors.length > 0 && (
            <div className="top-donors-container" style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '18px' }}>Top Donors</h3>
              {topDonors.map((donor, index) => (
                <div className="top-donor" key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                  padding: '8px 0',
                  borderBottom: index < topDonors.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div className="donor-rank" style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>{index + 1}</div>
                  <div className="donor-details" style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <div className="donor-name" style={{ fontWeight: '500' }}>{donor.donor.name}</div>
                    <div className="donor-amount" style={{ fontWeight: '600', color: '#982e4b' }}>₹{donor.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="modal-overlay">
          <div className="report-modal" ref={reportModalRef}>
            <h2><FaFlag /> Report Fundraiser</h2>
            <form onSubmit={reportFundraiser}>
              {reportErrorMessage && (
                <div className="error-message-container" style={errorMessageStyle}>
                  <FaExclamationCircle /> {reportErrorMessage}
                </div>
              )}
              
              {reportSuccessMessage && (
                <div className="success-message-container" style={successMessageStyle}>
                  <FaHeart /> {reportSuccessMessage}
                </div>
              )}

              <div className="form-group">
                <label>Reason for reporting:</label>
                <select 
                  value={reportReason} 
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="fraud">Suspected fraud</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="misinformation">Misinformation</option>
                  <option value="duplicate">Duplicate fundraiser</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Additional details:</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please provide more information about why you're reporting this fundraiser"
                  rows={4}
                />
              </div>
              
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowReportModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showContactModal && (
        <div className="modal-overlay">
          <div className="contact-modal" ref={contactModalRef}>
            <h2><FaEnvelope /> Contact Organizer</h2>
            <form onSubmit={contactOrganizer}>
              {contactErrorMessage && (
                <div className="error-message-container" style={errorMessageStyle}>
                  <FaExclamationCircle /> {contactErrorMessage}
                </div>
              )}
              
              {contactSuccessMessage && (
                <div className="success-message-container" style={successMessageStyle}>
                  <FaHeart /> {contactSuccessMessage}
                </div>
              )}

              <div className="form-group">
                <label>Your name:</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Your email:</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Message:</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Your message to the organizer"
                  rows={4}
                  required
                />
              </div>
              
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowContactModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundraiserDetails;