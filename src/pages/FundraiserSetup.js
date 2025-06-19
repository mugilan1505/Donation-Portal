import React, { useState, useEffect, useRef } from 'react';
import {
  FaHeartbeat, FaUserGraduate, FaPrayingHands, FaEllipsisH,
  FaUser, FaUsers, FaBuilding, FaPlus, FaUpload, FaMapMarkerAlt,
  FaHospital, FaFileUpload, FaImage, FaCheckCircle, FaExclamationCircle,
  FaRupeeSign, FaCalendarAlt, FaMoneyBillWave, FaUniversity, FaFile,
  FaBold, FaItalic, FaListUl, FaLink
} from 'react-icons/fa';
import axiosInstance from '../axios';
import '../styles/FundraiserSetup.css';
import ImageUpload from '../components/ImageUpload';

const causes = [
  { 
    id: 'medical', 
    label: 'Medical', 
    icon: <FaHeartbeat />,
    description: 'For medical treatments, surgeries, and healthcare needs',
    examples: ['Cancer Treatment', 'Organ Transplant', 'Accident Recovery']
  },
  { 
    id: 'education', 
    label: 'Education', 
    icon: <FaUserGraduate />,
    description: 'For education fees, scholarships, and learning resources',
    examples: ['School Fees', 'College Tuition', 'Study Materials']
  },
  { 
    id: 'memorial', 
    label: 'Memorial', 
    icon: <FaPrayingHands />,
    description: 'In memory of loved ones and funeral expenses',
    examples: ['Funeral Expenses', 'Memorial Service', 'Family Support']
  },
  { 
    id: 'others', 
    label: 'Others', 
    icon: <FaEllipsisH />,
    description: 'For other personal or social causes',
    examples: ['Community Project', 'Animal Welfare', 'Environmental Cause']
  },
];

const beneficiaries = [
  {
    id: 'myself',
    name: 'Myself',
    description: 'I am raising funds for my own needs',
    icon: <FaUser />,
    types: [],
    requiredDocs: ['Identity Proof', 'Address Proof']
  },
  {
    id: 'family',
    name: 'My family',
    description: 'Next of kin & relatives',
    icon: <FaUsers />,
    types: ['individual', 'group'],
    requiredDocs: ['Identity Proof', 'Relationship Proof', 'Medical Documents']
  },
  {
    id: 'friends',
    name: 'Friends or Colleagues',
    description: 'Friends, classmates, colleagues & acquaintances',
    icon: <FaUsers />,
    types: ['individual', 'group'],
    requiredDocs: ['Identity Proof', 'Authorization Letter']
  },
  {
    id: 'ngo',
    name: 'Registered NGO',
    description: 'A registered not-for-profit organization',
    icon: <FaBuilding />,
    types: [],
    requiredDocs: ['Registration Certificate', 'PAN Card', '80G Certificate']
  }
];

const FundraiserSetup = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCause, setSelectedCause] = useState('medical');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const storyEditorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    list: false,
    link: false
  });
  const [formData, setFormData] = useState({
    // Basic Details
    estimatedCost: '',
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    
    // Beneficiary Details
    beneficiary: 'myself',
    beneficiaryType: 'individual',
    beneficiaryName: '',
    beneficiaryPhoto: null,
    age: '',
    gender: 'male',
    location: '',
    
    // Cause Details
    title: '',
    story: '',
    photo: null,
    documents: [],
    targetAmount: '',
    
    // Bank Details
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: ''
  });

  // Override window.alert to prevent system alerts
  const originalAlert = window.alert;

  // Calculate form progress
  useEffect(() => {
    const calculateProgress = () => {
      // Calculate progress as percentage of current step out of total steps
      const progress = ((step - 1) / 3) * 100;
      setFormProgress(progress);
    };

    calculateProgress();
  }, [step]);

  useEffect(() => {
    // Override window.alert to disable system alerts for success messages
    window.alert = (message) => {
      if (message === 'Fundraiser created successfully!') {
        // Ignore this specific success message
        return;
      }
      // For all other messages, use the original alert
      originalAlert(message);
    };
    
    // Restore original alert on component unmount
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-populate related fields
      if (field === 'beneficiaryName') {
        newData.beneficiaryName = value;
      }
      
      // Clear medical fields if cause changes
      if (field === 'selectedCause' && value !== 'medical') {
        newData.location = '';
      }
      
      return newData;
    });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validatePanel1 = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.estimatedCost) {
      newErrors.estimatedCost = 'Estimated cost is required';
    } else if (isNaN(formData.estimatedCost) || formData.estimatedCost < 1000) {
      newErrors.estimatedCost = 'Amount must be at least ₹1,000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePanel2 = () => {
    const newErrors = {};
    
    if (!formData.beneficiaryName) {
      newErrors.beneficiaryName = 'Name is required';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 0 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePanel3 = () => {
    const newErrors = {};
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    
    if (!formData.story) {
      newErrors.story = 'Story is required';
    } else if (formData.story.length < 100) {
      newErrors.story = 'Story must be at least 100 characters';
    }
    
    if (!formData.photo) {
      newErrors.photo = 'Cover photo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePanel4 = () => {
    const newErrors = {};
    
    if (!formData.targetAmount) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (isNaN(formData.targetAmount) || formData.targetAmount < 1000) {
      newErrors.targetAmount = 'Target amount must be at least ₹1,000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    let isValid = false;
    
    switch (step) {
      case 1:
      isValid = validatePanel1();
        break;
      case 2:
      isValid = validatePanel2();
        break;
      case 3:
        isValid = validatePanel3();
        break;
      case 4:
        isValid = validatePanel4();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setErrors({});
      if (step < 4) {
      setStep(step + 1);
      } else {
        handleFinalSubmit();
      }
    }
  };

  const handleBeneficiarySelect = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setFormData({
      ...formData,
      beneficiary: beneficiary.id,
      beneficiaryType: ''
    });
    setErrors({ ...errors, beneficiary: '' });
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({ ...prev, photo: imageUrl }));
  };

  // File upload handling
  const handleFileUpload = (field, files) => {
    if (!files || files.length === 0) return;
    
    // For multiple files (documents)
    if (field === 'documents') {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file
      }));
      
      setFormData({
        ...formData,
        documents: [...formData.documents, ...newFiles]
      });
      
      setErrors({
        ...errors,
        documents: ''
      });
    } 
    // For single file (photo or beneficiaryPhoto)
    else {
      const file = files[0];
      setFormData({
        ...formData,
        [field]: URL.createObjectURL(file)
      });
      
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (field) => {
    if (field === 'documents') {
      setFormData({
        ...formData,
        documents: []
      });
    } else {
      setFormData({
        ...formData,
        [field]: null
      });
    }
  };
  
  // Remove a specific document by index
  const handleRemoveDocument = (index) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments.splice(index, 1);
    
    setFormData({
      ...formData,
      documents: updatedDocuments
    });
    
    if (updatedDocuments.length === 0) {
      setErrors({
        ...errors,
        documents: 'Please upload at least one medical document'
      });
    }
  };

  // Text formatting functions for the story editor
  const applyTextFormat = (format) => {
    // Toggle active state for the clicked format
    setActiveFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
    
    // Get the textarea element
    const textArea = storyEditorRef.current;
    if (!textArea) return;
    
    // Get the current position
    const cursorPos = textArea.selectionStart;
    const selectionEnd = textArea.selectionEnd;
    const hasSelection = selectionEnd > cursorPos;
    
    // Different handling based on format
    switch (format) {
      case 'bold':
        if (hasSelection) {
          // If text is selected, wrap it with ** markers
          const selectedText = formData.story.substring(cursorPos, selectionEnd);
          const newText = 
            formData.story.substring(0, cursorPos) + 
            `**${selectedText}**` + 
            formData.story.substring(selectionEnd);
          
          setFormData(prev => ({ ...prev, story: newText }));
          
          // Place cursor after the formatted text
          setTimeout(() => {
            textArea.focus();
            textArea.setSelectionRange(selectionEnd + 4, selectionEnd + 4);
          }, 0);
        } else {
          // Just insert bold text placeholder
          const newText = 
            formData.story.substring(0, cursorPos) + 
            '**Bold text**' + 
            formData.story.substring(cursorPos);
          
          setFormData(prev => ({ ...prev, story: newText }));
          
          // Select "Bold text" for easy replacement
          setTimeout(() => {
            textArea.focus();
            textArea.setSelectionRange(cursorPos + 2, cursorPos + 11);
          }, 0);
        }
        break;
        
      case 'italic':
        if (hasSelection) {
          // If text is selected, wrap it with _ markers
          const selectedText = formData.story.substring(cursorPos, selectionEnd);
          const newText = 
            formData.story.substring(0, cursorPos) + 
            `_${selectedText}_` + 
            formData.story.substring(selectionEnd);
          
          setFormData(prev => ({ ...prev, story: newText }));
          
          // Place cursor after the formatted text
          setTimeout(() => {
            textArea.focus();
            textArea.setSelectionRange(selectionEnd + 2, selectionEnd + 2);
          }, 0);
        } else {
          // Just insert italic text placeholder
          const newText = 
            formData.story.substring(0, cursorPos) + 
            '_Italic text_' + 
            formData.story.substring(cursorPos);
          
          setFormData(prev => ({ ...prev, story: newText }));
          
          // Select "Italic text" for easy replacement
          setTimeout(() => {
            textArea.focus();
            textArea.setSelectionRange(cursorPos + 1, cursorPos + 12);
          }, 0);
        }
        break;
        
      case 'list':
        // Get the line start position
        let lineStart = cursorPos;
        while (lineStart > 0 && formData.story.charAt(lineStart - 1) !== '\n') {
          lineStart--;
        }
        
        // Insert bullet point at the beginning of the line or add a new line
        const needsNewLine = lineStart !== 0 && lineStart !== cursorPos;
        const newListText = 
          formData.story.substring(0, lineStart) + 
          (needsNewLine ? '\n- ' : '- ') + 
          formData.story.substring(lineStart);
        
        setFormData(prev => ({ ...prev, story: newListText }));
        
        // Place cursor after the bullet point
        const newPos = lineStart + (needsNewLine ? 3 : 2);
        setTimeout(() => {
          textArea.focus();
          textArea.setSelectionRange(newPos, newPos);
        }, 0);
        break;
        
      case 'link':
        if (hasSelection) {
          // If text is selected, use it as the link text
          const selectedText = formData.story.substring(cursorPos, selectionEnd);
          const newText = 
            formData.story.substring(0, cursorPos) + 
            `[${selectedText}](https://example.com)` + 
            formData.story.substring(selectionEnd);
          
          setFormData(prev => ({ ...prev, story: newText }));
          
          // Select the URL for easy replacement
          const urlStart = cursorPos + selectedText.length + 3;
          setTimeout(() => {
            textArea.focus();
            textArea.setSelectionRange(urlStart, urlStart + 18);
          }, 0);
        } else {
          // Insert a link placeholder
          const newText = 
            formData.story.substring(0, cursorPos) + 
            '[Link text](https://example.com)' + 
            formData.story.substring(cursorPos);
          
          setFormData(prev => ({ ...prev, story: newText }));
          
          // Select "Link text" for easy replacement
          setTimeout(() => {
            textArea.focus();
            textArea.setSelectionRange(cursorPos + 1, cursorPos + 10);
          }, 0);
        }
        break;
        
      default:
        break;
    }
  };
  
  // Handle story text changes
  const handleStoryChange = (e) => {
    // Update the form data using the regular handleChange function
    handleChange('story', e.target.value);
    
    // Keep track of the cursor position
    const cursorPos = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;
    
    // Restore the cursor position after React re-renders
    setTimeout(() => {
      if (storyEditorRef.current) {
        storyEditorRef.current.focus();
        storyEditorRef.current.setSelectionRange(cursorPos, selectionEnd);
      }
    }, 0);
  };

  const handleFinalSubmit = async () => {
    if (!validatePanel4()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Validate required fields
      const requiredFields = {
        beneficiaryName: 'Beneficiary Name',
        age: 'Age',
        gender: 'Gender',
        location: 'Location'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !formData[key])
        .map(([, label]) => label);

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      // Prepare form data for submission
      const fundraiserData = {
        title: formData.title,
        description: formData.story,
        goalAmount: parseFloat(formData.targetAmount),
        category: selectedCause,
        beneficiary: {
          name: formData.beneficiaryName,
          age: parseInt(formData.age),
          gender: formData.gender,
          location: formData.location,
          type: formData.beneficiaryType || 'individual',
          relationship: formData.beneficiary
        },
        medicalDetails: selectedCause === 'medical' ? {
          healthIssue: formData.title, // Using title as health issue if not provided
          hospital: '',
          doctorName: '',
          cityOfTreatment: formData.location
        } : null,
        campaignDetails: {
          duration: 30,
          urgency: 'normal',
          taxBenefits: false
        },
        creatorDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.countryCode + formData.phone
        },
        // For a real implementation, you would upload the image file to a server
        // and store the URL. Here we're just passing the local URL for demonstration.
        image: formData.photo || 'https://via.placeholder.com/800x400?text=Fundraiser+Image'
      };

      // Send data to backend - using the API instance with the configured baseURL
      console.log('Sending fundraiser data:', fundraiserData);
      const response = await axiosInstance.post('/fundraisers', fundraiserData);
      
      if (response.data) {
        // Redirect directly to the fundraiser page without showing alert
        window.location.href = `/fundraiser/${response.data._id}`;
      }
    } catch (error) {
      console.error('Error creating fundraiser:', error);
      
      // Extract and show detailed error message
      let errorMessage = 'Failed to create fundraiser. Please try again.';
      if (error.response && error.response.data) {
        const { message, details } = error.response.data;
        errorMessage = message || errorMessage;
        
        if (details && details.length > 0) {
          const fieldErrors = details.map(d => `${d.field}: ${d.message}`).join('\n');
          errorMessage += `\n\nField errors:\n${fieldErrors}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fundraiser-setup">
      <div className="setup-header">
        <h2>{getStepTitle(step)}</h2>
        <div className="progress-indicator">
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${formProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="form-panels">
        <div className={`panel ${step === 1 ? 'active' : ''}`}>
          <h3>I am raising funds for a/an <span className="highlight">{selectedCause}</span> cause</h3>
          
          <div className="cause-grid">
            <div 
              className={`cause-card ${selectedCause === 'medical' ? 'active' : ''}`}
              onClick={() => setSelectedCause('medical')}
            >
              <div className="cause-icon">
                <FaHeartbeat />
              </div>
              <span>Medical</span>
        </div>

            <div 
              className={`cause-card ${selectedCause === 'education' ? 'active' : ''}`}
              onClick={() => setSelectedCause('education')}
            >
              <div className="cause-icon">
                <FaUserGraduate />
              </div>
              <span>Education</span>
            </div>
            
            <div 
              className={`cause-card ${selectedCause === 'memorial' ? 'active' : ''}`}
              onClick={() => setSelectedCause('memorial')}
            >
              <div className="cause-icon">
                <FaPrayingHands />
              </div>
              <span>Memorial</span>
            </div>

            <div 
              className={`cause-card ${selectedCause === 'others' ? 'active' : ''}`}
              onClick={() => setSelectedCause('others')}
            >
              <div className="cause-icon">
                <FaEllipsisH />
              </div>
              <span>Others</span>
            </div>
                </div>
          
          <div className="form-group currency-input">
            <label>
              <select 
                className="currency-select"
                value="INR"
                disabled
              >
                <option value="INR">INR</option>
              </select>
            </label>
                <input
                  type="text"
                  value={formData.estimatedCost}
                  onChange={(e) => handleChange('estimatedCost', e.target.value)}
              placeholder="Estimated cost"
              className="cost-input"
                />
            {errors.estimatedCost && <div className="error-message">{errors.estimatedCost}</div>}
              </div>

          <div className="form-group">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Name"
              className="text-input"
                />
            {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

          <div className="form-group">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email ID"
              className="text-input"
                />
            {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

          <div className="form-group phone-input-group">
                  <select
              className="country-code-select"
                    value={formData.countryCode}
                    onChange={(e) => handleChange('countryCode', e.target.value)}
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
              <option value="+44">+44</option>
                  </select>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone number"
              className="phone-input"
                  />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>

        <div className={`panel ${step === 2 ? 'active' : ''}`}>
          <h3>This fundraiser will benefit</h3>
          
          <div className="dropdown-select">
            <select
              value={formData.beneficiary}
              onChange={(e) => {
                handleChange('beneficiary', e.target.value);
              }}
              className="beneficiary-select"
            >
              <option value="myself">Myself</option>
              <option value="family">My family</option>
              <option value="friends">My friends</option>
              <option value="ngo">Registered NGO</option>
            </select>
          </div>
          
          {(formData.beneficiary === 'family' || formData.beneficiary === 'friends') && (
            <div className="beneficiary-type-options">
              <div 
                className={`type-option ${formData.beneficiaryType === 'individual' ? 'active' : ''}`}
                onClick={() => handleChange('beneficiaryType', 'individual')}
              >
                <FaUser className="type-icon" />
                <span>Individual</span>
                  </div>
              <div 
                className={`type-option ${formData.beneficiaryType === 'group' ? 'active' : ''}`}
                onClick={() => handleChange('beneficiaryType', 'group')}
              >
                <FaUsers className="type-icon" />
                <span>Group</span>
                </div>
              </div>
            )}

          <div className="beneficiary-photo-upload">
            <div className="photo-circle">
              {formData.beneficiaryPhoto ? (
                <img src={formData.beneficiaryPhoto} alt="Beneficiary" />
              ) : (
                <FaPlus className="add-photo-icon" />
              )}
            </div>
            <span>Display photo</span>
            <input
              type="file"
              id="beneficiary-photo"
              accept="image/*"
              onChange={(e) => handleFileUpload('beneficiaryPhoto', e.target.files)}
              style={{ display: 'none' }}
            />
            <label htmlFor="beneficiary-photo" className="hidden-upload"></label>
          </div>
          
          <div className="form-group">
            <div className="input-with-label">
              <span className="floating-label">I'm</span>
              <input
                type="text"
                value={formData.beneficiaryName}
                onChange={(e) => handleChange('beneficiaryName', e.target.value)}
                placeholder="Full name"
                className="text-input with-label"
              />
            </div>
            {errors.beneficiaryName && <div className="error-message">{errors.beneficiaryName}</div>}
            </div>

          <div className="form-group age-group">
            <div className="input-with-label">
              <span className="floating-label">Age</span>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Age"
                className="text-input with-label age-input"
              />
            </div>
            <select className="age-unit">
              <option value="years">years</option>
            </select>
            {errors.age && <div className="error-message">{errors.age}</div>}
            </div>

          <div className="gender-selection">
            <div 
              className={`gender-option ${formData.gender === 'male' ? 'active' : ''}`}
              onClick={() => handleChange('gender', 'male')}
            >
              <span className="gender-check">✓</span>
              <span>Male</span>
            </div>
            <div 
              className={`gender-option ${formData.gender === 'female' ? 'active' : ''}`}
              onClick={() => handleChange('gender', 'female')}
            >
              <span className="gender-check">✓</span>
              <span>Female</span>
            </div>
            <div 
              className={`gender-option ${formData.gender === 'other' ? 'active' : ''}`}
              onClick={() => handleChange('gender', 'other')}
            >
              <span className="gender-check">✓</span>
              <span>Others</span>
                </div>
                </div>
          
          <div className="form-group">
            <div className="input-with-label">
              <span className="floating-label">I'm residing in</span>
                  <input
                    type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Ex: Bengaluru"
                className="text-input with-label"
                  />
                </div>
            {errors.location && <div className="error-message">{errors.location}</div>}
                </div>
              </div>

        <div className={`panel ${step === 3 ? 'active' : ''}`}>
          <h3>Elaborate cause details</h3>

          <div className="cover-photo-upload">
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={formData.photo}
              type="fundraiser"
              className="fundraiser-cover-upload"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Name your fundraiser"
              className="title-input"
            />
            <div className="example-text">Eg.: Help Hari fight cancer</div>
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group">
            <div className="editor-toolbar">
                  <button
                    type="button"
                className={activeFormats.bold ? 'active' : ''}
                onClick={() => applyTextFormat('bold')}
                  >
                <FaBold />
                  </button>
                  <button
                    type="button"
                className={activeFormats.italic ? 'active' : ''}
                onClick={() => applyTextFormat('italic')}
                  >
                <FaItalic />
                  </button>
                  <button
                    type="button"
                className={activeFormats.list ? 'active' : ''}
                onClick={() => applyTextFormat('list')}
              >
                <FaListUl />
              </button>
              <button 
                type="button" 
                className={activeFormats.link ? 'active' : ''}
                onClick={() => applyTextFormat('link')}
              >
                <FaLink />
              </button>
            </div>
            <textarea
              ref={storyEditorRef}
              value={formData.story}
              onChange={handleStoryChange}
              placeholder="Write your story. Keep it simple, personal, and about the specific use of funds.

Write about: Who is this fundraiser for? When do you need funds? How do you plan to use the funds?"
              rows={10}
              className="story-editor"
            />
            {errors.story && <div className="error-message">{errors.story}</div>}
          </div>
        </div>

        <div className={`panel ${step === 4 ? 'active' : ''}`}>
          <h3>Cause Details</h3>
          
          <div className="target-amount">
            <h4>I want to raise</h4>
            <div className="amount-input-group">
              <select 
                className="currency-select"
                value="INR"
                disabled
              >
                <option value="INR">INR</option>
              </select>
              <input
                type="text"
                value={formData.targetAmount}
                onChange={(e) => handleChange('targetAmount', e.target.value)}
                placeholder="2,00,000"
                className="amount-input"
              />
            </div>
          </div>
          
          <h3>I am raising funds for a/an <span className="highlight">{selectedCause}</span> cause</h3>
          
          <div className="cause-grid">
            <div 
              className={`cause-card ${selectedCause === 'medical' ? 'active' : ''}`}
              onClick={() => setSelectedCause('medical')}
            >
              <div className="cause-icon">
                <FaHeartbeat />
              </div>
              <span>Medical</span>
            </div>
            
            <div 
              className={`cause-card ${selectedCause === 'education' ? 'active' : ''}`}
              onClick={() => setSelectedCause('education')}
            >
              <div className="cause-icon">
                <FaUserGraduate />
              </div>
              <span>Education</span>
            </div>
            
            <div 
              className={`cause-card ${selectedCause === 'memorial' ? 'active' : ''}`}
              onClick={() => setSelectedCause('memorial')}
            >
              <div className="cause-icon">
                <FaPrayingHands />
              </div>
              <span>Memorial</span>
            </div>
            
            <div 
              className={`cause-card ${selectedCause === 'others' ? 'active' : ''}`}
              onClick={() => setSelectedCause('others')}
            >
              <div className="cause-icon">
                <FaEllipsisH />
              </div>
              <span>Others</span>
            </div>
          </div>
        </div>

        <div className="footer-bar">
          {step > 1 && (
            <button 
              className="back-button"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          )}
          
          {step > 1 && <button className="close-button">Close</button>}
          
          <button 
            className="continue-button"
            onClick={step === 4 ? handleFinalSubmit : handleContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : step === 4 ? 'Create Fundraiser' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

function getStepTitle(step) {
  switch (step) {
    case 1: return "Basic Details";
    case 2: return "Beneficiary details";
    case 3: return "Elaborate cause details";
    case 4: return "Cause Details";
    default: return "Fundraiser Setup";
  }
}

export default FundraiserSetup;

