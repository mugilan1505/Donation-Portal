import React, { useEffect, useState } from 'react';
import axios from '../axios';
import '../styles/FundraiserDetails.css';

const Donate = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const res = await axios.get('/fundraisers');
        setFundraisers(res.data);
      } catch (err) {
        setFundraisers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFundraisers();
  }, []);

  return (
    <div className="milaap-donate-page-bg">
      <h1 className="milaap-donate-title">Support a Fundraiser</h1>
      <p className="milaap-donate-desc">Thousands are crowdfunding for various causes. Support a fundraiser today.</p>
      <div className="milaap-donate-grid">
        {loading ? (
          <div className="loading">Loading fundraisers...</div>
        ) : fundraisers.length === 0 ? (
          <div className="no-data">No fundraisers found.</div>
        ) : (
          fundraisers.map(f => {
            const percent = Math.min(Math.round((f.raisedAmount / f.goalAmount) * 100), 100);
            return (
              <div className="milaap-donate-card" key={f._id}>
                <div className="milaap-donate-img-wrap">
                  {f.campaignDetails?.taxBenefits && (
                    <span className="milaap-donate-tax-badge">Tax benefits</span>
                  )}
                  <img
                    src={f.image}
                    alt={f.title}
                    className="milaap-donate-img"
                    onError={e => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/500x280/cccccc/333333?text=${encodeURIComponent(f.title.substring(0, 20))}`; }}
                  />
                </div>
                <div className="milaap-donate-content">
                  <h3 className="milaap-donate-card-title">{f.title.length > 60 ? f.title.slice(0, 57) + '...' : f.title}</h3>
                  <div className="milaap-donate-progress-row">
                    <div className="milaap-donate-progress-circle">
                      <svg width="38" height="38">
                        <circle cx="19" cy="19" r="16" fill="none" stroke="#eee" strokeWidth="5" />
                        <circle
                          cx="19" cy="19" r="16"
                          fill="none"
                          stroke="#4caf50"
                          strokeWidth="5"
                          strokeDasharray={`${percent * 1.005} ${100 - percent * 1.005}`}
                          strokeLinecap="round"
                          transform="rotate(-90 19 19)"
                        />
                        <text x="19" y="23" textAnchor="middle" fontSize="13" fill="#444">{percent}%</text>
                      </svg>
                    </div>
                    <div className="milaap-donate-raised-block">
                      <div className="milaap-donate-raised-label">Raised</div>
                      <div className="milaap-donate-raised-amt">₹{f.raisedAmount.toLocaleString()}</div>
                    </div>
                    <div className="milaap-donate-creator-block">
                      <div className="milaap-donate-creator-label">Created by</div>
                      <div className="milaap-donate-creator-name">{f.creatorDetails?.name || 'Organizer'}</div>
                    </div>
                  </div>
                  {f.campaignDetails?.taxBenefits && (
                    <div className="milaap-donate-tax-msg">Receive tax benefits by donating to this cause</div>
                  )}
                  <a href={`/fundraiser/${f._id}`} className="milaap-donate-card-btn">View & Donate</a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Donate; 