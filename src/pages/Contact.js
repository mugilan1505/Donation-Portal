import React, { useState } from "react";
import "../styles/Contact.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("❌ Failed to send message. Try again later.");
      }
    } catch (error) {
      setStatus("❌ Error: " + error.message);
    }
  };

  return (
    <div className="enhanced-contact-wrapper">
      <div className="enhanced-contact-header">
        <h1>Get In Touch</h1>
        <p>We’re happy to answer your questions. Reach out to us anytime!</p>
      </div>

      <div className="enhanced-contact-grid">
        {/* Contact Form */}
        <form className="enhanced-contact-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <div>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <label>Subject</label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject of your message"
          />

          <label>Message</label>
          <textarea
            name="message"
            rows="5"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
          ></textarea>

          <button type="submit">Send Message</button>
          {status && <p className="form-status">{status}</p>}
        </form>

        {/* Info & Map */}
        <div className="enhanced-contact-info">
          <div className="info-box">
            <h2>📍 Address</h2>
            <p>TVK Crowdfunding Pvt. Ltd.<br/>123 Anna Salai, Chennai, India</p>
          </div>
          <div className="info-box">
            <h2>📞 Call Us</h2>
            <p>+91 98765 43210</p>
          </div>
          <div className="info-box">
            <h2>📧 Email</h2>
            <p>support@tvkcrowdfunding.com</p>
          </div>
          

          <div className="map-embed">
            <iframe
              title="Google Map"
              src="https://maps.google.com/maps?q=chennai&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="200"
              frameBorder="0"
              style={{ borderRadius: "12px" }}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
