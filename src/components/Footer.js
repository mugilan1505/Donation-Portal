import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo & Description */}
        <div className="footer-section">
          <h2>TVK Crowdfunding</h2>
          <p>Empowering people to raise funds for medical, education, and social causes. Join us to make a difference!</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
          </ul>
        </div>

        {/* Fundraising Categories */}
        <div className="footer-section">
          <h3>Fundraising Categories</h3>
          <ul>
            <li><Link to="/category/medical">Medical</Link></li>
            <li><Link to="/category/education">Education</Link></li>
            <li><Link to="/category/charity">Charity</Link></li>
            <li><Link to="/category/disaster-relief">Disaster Relief</Link></li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@tvkcrowdfunding.com</p>
          <p>Phone: +91 98765 43210</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="footer-bottom">
        <p>© 2025 TVK Crowdfunding - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
