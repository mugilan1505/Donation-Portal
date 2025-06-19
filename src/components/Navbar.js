import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaUser, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // For debugging - remove in production
  useEffect(() => {
    console.log("Current user in Navbar:", user);
  }, [user]);

  const handleProfileClick = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const handleSignup = () => {
    navigate("/register");
    setIsDropdownOpen(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log("Logging out user");
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const handleStartFundraiser = () => {
    if (!user) {
      // Store the intended destination
      localStorage.setItem('redirectAfterLogin', '/start-fundraiser');
      navigate('/login');
    } else {
      navigate('/start-fundraiser');
    }
  };

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isLoggedIn = Boolean(user);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <span className="logo-icon">💖</span>
        <Link to="/">TVK</Link>
      </div>

      {/* Links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/donate">Donate</Link></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to="/contact">Contact us</Link></li>
      </ul>

      {/* Right Section */}
      <div className="navbar-right">
        <button 
          className="fundraiser-btn" 
          onClick={handleStartFundraiser}
        >
          Start a fundraiser
        </button>

       {/* User Profile Button with Dropdown */}
        <div className="profile-container" ref={dropdownRef}>
          <button 
            className="profile-btn" 
            onClick={handleProfileClick}
    aria-label={isLoggedIn ? 'User menu' : 'Login or register'}
          >
            <FaUserCircle className="profile-icon" />
          </button>

          {isDropdownOpen && (
    <div className="auth-dropdown">
      {!isLoggedIn ? (
        <div className="auth-menu">
          <button className="auth-menu-btn login-btn" onClick={handleLogin}>
            Login
          </button>
          <button className="auth-menu-btn register-btn" onClick={handleSignup}>
            Register
          </button>
        </div>
      ) : (
        <div className="user-menu">
          {/* User Info */}
          <div className="user-info">
            <FaUserCircle className="user-avatar" />
            <div className="user-details">
              <span className="user-fullname">{user?.name || "User"}</span>
              <span className="user-email">{user?.email || "user@example.com"}</span>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          {/* Profile Link */}
          <button className="dropdown-item" onClick={handleProfile}>
            <FaUser className="dropdown-icon" />
            My Profile
          </button>

          {/* Dashboard Link */}
          <button className="dropdown-item" onClick={handleDashboard}>
            <FaTachometerAlt className="dropdown-icon" />
            Dashboard
          </button>

          <div className="dropdown-divider"></div>

          {/* Logout */}
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="dropdown-icon" />
            Logout
          </button>
        </div>
      )}
    </div>
  )}
</div>

      </div>
    </nav>
  );
};

export default Navbar;
