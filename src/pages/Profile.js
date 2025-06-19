import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaChevronDown, FaChevronUp, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import "../styles/Profile.css";

const DEFAULT_COUNTRY_CODE = "91";

const MilaapProfileEdit = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPAN, setShowPAN] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: DEFAULT_COUNTRY_CODE,
    phone: "",
    pan: "",
    profileImage: ""
  });

  useEffect(() => {
    if (user) {
      const [firstName, ...rest] = user.name ? user.name.split(" ") : [""];
      setForm({
        firstName: firstName || "",
        lastName: rest.join(" ") || "",
        email: user.email || "",
        countryCode: user.phone ? user.phone.slice(0, 2) : DEFAULT_COUNTRY_CODE,
        phone: user.phone ? user.phone.slice(2) : "",
        pan: "",
        profileImage: user.profileImage || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageUrl) => {
    setForm(prev => ({ ...prev, profileImage: imageUrl }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save profile
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="not-logged-in">
        <h2>Please login to view your profile</h2>
        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  return (
    <div className="milaap-profile-edit-bg">
      <form className="milaap-profile-card" onSubmit={handleSave}>
        <div className="milaap-profile-avatar-section">
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={form.profileImage}
            type="profile"
            className="profile-image-upload"
          />
          <div className="milaap-profile-avatar-name">{form.firstName} {form.lastName}</div>
        </div>
        <div className="milaap-profile-section">
          <div className="milaap-profile-section-header">Profile details</div>
          <div className="milaap-profile-grid">
            <div className="milaap-profile-field">
              <label>First name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleInputChange} required />
            </div>
            <div className="milaap-profile-field">
              <label>Last name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleInputChange} />
            </div>
            <div className="milaap-profile-field">
              <label>Registered Email</label>
              <input type="email" name="email" value={form.email} disabled />
            </div>
            <div className="milaap-profile-field">
              <label>Phone number</label>
              <div className="milaap-profile-phone-group">
                <input type="text" name="countryCode" value={form.countryCode} maxLength={3} style={{width: '50px'}} onChange={handleInputChange} disabled />
                <input type="text" name="phone" value={form.phone} maxLength={15} onChange={handleInputChange} disabled />
              </div>
            </div>
          </div>
        </div>
        <div className="milaap-profile-section milaap-profile-accordion">
          <div className="milaap-profile-section-header milaap-profile-accordion-header" onClick={() => setShowPAN((prev) => !prev)}>
            PAN details {showPAN ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showPAN && (
            <div className="milaap-profile-grid">
              <div className="milaap-profile-field">
                <label>PAN Number</label>
                <input type="text" name="pan" value={form.pan} onChange={handleInputChange} />
              </div>
            </div>
          )}
        </div>
        <button className="milaap-profile-save-btn" type="submit">
          <FaSave style={{marginRight:'8px'}} />Save
        </button>
      </form>
    </div>
  );
};

export default MilaapProfileEdit;
