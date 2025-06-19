import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBullhorn, FaSearch, FaHeart, FaBook, FaAmbulance, FaPaw } from "react-icons/fa";
import "../styles/Home.css";


// Categories
const categories = [
  { id: "medical", name: "Medical", icon: <FaHeart className="category-icon" /> },
  { id: "education", name: "Education", icon: <FaBook className="category-icon" /> },
  { id: "emergencies", name: "Emergencies", icon: <FaAmbulance className="category-icon" /> },
  { id: "animals", name: "Animals", icon: <FaPaw className="category-icon" /> }
];

// Fundraisers Data
const fundraisers = {
  medical: [
    { id: 1, title: "Help John Fight Cancer", raised: 15000, goal: 25000, creator: "Alice Johnson", image: "../assets/hero-bg.jpg.jpeg" },
    { id: 2, title: "Surgery for Maria", raised: 8000, goal: 20000, creator: "Bob Smith", image: "../assets/hero-bg1.jpg.jpeg" }
  ],
  education: [
    { id: 3, title: "Scholarship for Alex", raised: 5000, goal: 10000, creator: "Charlie Brown", image: "../assets/student-bg1.jpeg" },
    { id: 4, title: "School Supplies for Kids", raised: 3500, goal: 7000, creator: "Diana White", image: "../assets/student-bg2.jpeg" }
  ],
  emergencies: [
    { id: 5, title: "Flood Relief for Chennai", raised: 12000, goal: 50000, creator: "Relief Org", image: "../assets/emergencies-bg4.jpeg" },
    { id: 6, title: "Earthquake Victims Support", raised: 18000, goal: 60000, creator: "Disaster Aid", image: "../assets/emergencies-bg2.jpeg" }
  ],
  animals: [
    { id: 7, title: "Rescue Injured Stray Dogs", raised: 7000, goal: 15000, creator: "Animal Shelter", image: "../assets/animals-bg1.jpeg" },
    { id: 8, title: "Wildlife Conservation Project", raised: 25000, goal: 50000, creator: "Green Earth Org", image: "../assets/animals-bg4.jpeg" }
  ]
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="text">
            <h1>TVK Crowdfunding</h1>
            <h2>Funding Dreams with Trust, Value, and Kindness</h2>
            <p>Raise funds online for medical emergencies, education, and social causes.</p>
            <Link to="/start-fundraiser" className="cta-btn">
              Start a fundraiser - it's FREE
            </Link>
          </div>
          <div className="hero-image">
            <img src="../assets/hero-bg2.jpg.jpeg" alt="Helping Patients" />
          </div>
        </div>
      </section>

      {/* Fundraising Fee Banner */}
      <div className="fundraising-fee">
        <FaBullhorn className="icon" />
        <p>Our crowdfunding platform charges <strong>NO fees</strong></p>
        <span className="percentage">0%</span>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <h2>Find a Fundraiser</h2>
        <div className="search-form">
          <input type="text" placeholder="Search fundraisers..." />
          <button><FaSearch /></button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2>Explore Fundraisers by Category</h2>
        <div className="categories-container">
          {categories.map((category) => (
            <div key={category.id} className="category-card" onClick={() => setSelectedCategory(category.id)}>
              {category.icon}
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fundraisers List */}
      {selectedCategory && fundraisers[selectedCategory]?.length > 0 ? (
        <div className="fundraisers-list">
          <h2>{categories.find((c) => c.id === selectedCategory)?.name} Fundraisers</h2>
          <div className="fundraisers-container">
            {fundraisers[selectedCategory].map((fundraiser) => {
              const progress = (fundraiser.raised / fundraiser.goal) * 100;

              return (
                <div key={fundraiser.id} className="fundraiser-card">
                  <img src={fundraiser.image} alt={fundraiser.title} />
                  <h3>{fundraiser.title}</h3>

                  {/* Progress Bar */}
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    <span className="progress-text">{Math.round(progress)}% Raised</span>
                  </div>

                  <p>Raised: ₹{fundraiser.raised.toLocaleString()} / ₹{fundraiser.goal.toLocaleString()}</p>

                  {/* Fundraiser Creator */}
                  <div className="fundraiser-creator">
                    <span>Created by</span>
                    <div className="tooltip">
                      <span className="creator-name">{fundraiser.creator.split(" ")[0]}...</span>
                      <div className="tooltip-text">{fundraiser.creator}</div>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <Link
               to={`/fundraiser/${selectedCategory}/${fundraiser.id}`}
               className="donate-btn">Donate Now</Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        selectedCategory && (
          <p className="no-fundraisers">No fundraisers available in this category.</p>
        )
      )}
    </div>
  );
};

export default Home;
