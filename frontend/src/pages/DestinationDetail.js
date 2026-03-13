import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLocation, addReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './DestinationDetail.css';

const StarPicker = ({ value, onChange }) => (
  <div className="star-picker">
    {[1,2,3,4,5].map(n => (
      <button key={n} onClick={() => onChange(n)} className={`star-btn ${n <= value ? 'filled' : ''}`}>&#9733;</button>
    ))}
  </div>
);

const DestinationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getLocation(id)
      .then(res => { setData(res.data.location); setReviews(res.data.reviews); })
      .catch(() => navigate('/explore'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to write a review'); navigate('/login'); return; }
    setSubmitting(true);
    try {
      await addReview(id, reviewForm);
      toast.success('Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      const res = await getLocation(id);
      setData(res.data.location); setReviews(res.data.reviews);
    } catch { toast.error('Failed to submit review'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!data) return null;

  const tabs = ['overview', 'culture', 'food', 'festivals', 'safety', 'reviews'];

  return (
    <div className="detail-page">
      <div className="detail-hero" style={{ backgroundImage: `url(${data.image_url || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400'})` }}>
        <div className="detail-hero-overlay" />
        <div className="container detail-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link> &nbsp;/&nbsp; <Link to="/explore">Explore</Link> &nbsp;/&nbsp; {data.name}
          </div>
          <div className="detail-state">{data.state}</div>
          <h1>{data.name}</h1>
          <div className="detail-meta">
            <div className="detail-rating">
              <span className="detail-rating-stars">{'★'.repeat(Math.round(data.rating))}{'☆'.repeat(5-Math.round(data.rating))}</span>
              <span className="detail-rating-num">{Number(data.rating).toFixed(1)}</span>
              <span className="detail-rating-count">{data.review_count} reviews</span>
            </div>
          </div>
          <div className="detail-hero-actions">
            <Link to={`/community/${id}`} className="action-btn community">Traveler Chat</Link>
            <Link to="/assistant" className="action-btn ai">Ask Atlas</Link>
            <Link to="/nearby" state={{ lat: data.latitude, lng: data.longitude, name: data.name }} className="action-btn nearby">Nearby Services</Link>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-tabs">
          {tabs.map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="detail-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>About {data.name}</h2>
              <p className="overview-text">{data.description}</p>
              <div className="overview-grid">
                <div className="info-card"><div className="info-icon">&#9670;</div><div><div className="info-label">Culture</div><p className="info-content">{data.culture?.substring(0,130)}...</p></div></div>
                <div className="info-card"><div className="info-icon">&#9670;</div><div><div className="info-label">Food</div><p className="info-content">{data.food?.substring(0,130)}...</p></div></div>
                <div className="info-card"><div className="info-icon">&#9670;</div><div><div className="info-label">Festivals</div><p className="info-content">{data.festivals?.substring(0,130)}...</p></div></div>
                <div className="info-card"><div className="info-icon">&#9670;</div><div><div className="info-label">Safety</div><p className="info-content">{data.safety?.substring(0,130)}...</p></div></div>
              </div>
            </div>
          )}

          {activeTab === 'culture' && (
            <div className="tab-content">
              <div className="content-section">
                <span className="content-section-label">Culture & Heritage</span>
                <h2>Local Culture</h2>
                <p>{data.culture}</p>
                <div className="lifestyle-box">
                  <h3>Local Lifestyle</h3>
                  <p>{data.lifestyle}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'food' && (
            <div className="tab-content">
              <div className="content-section">
                <span className="content-section-label">Cuisine</span>
                <h2>Local Food</h2>
                <p>{data.food}</p>
              </div>
            </div>
          )}

          {activeTab === 'festivals' && (
            <div className="tab-content">
              <div className="content-section">
                <span className="content-section-label">Events & Festivals</span>
                <h2>Festivals</h2>
                <p>{data.festivals}</p>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="tab-content">
              <h2>Safety & Travel Tips</h2>
              <div className="safety-box"><p>{data.safety}</p></div>
              <div className="emergency-links">
                <h3>Emergency Contacts</h3>
                <div className="emergency-grid">
                  <div className="emergency-card police">Police &mdash; 100</div>
                  <div className="emergency-card ambulance">Ambulance &mdash; 108</div>
                  <div className="emergency-card fire">Fire &mdash; 101</div>
                  <div className="emergency-card tourist">Tourist Helpline &mdash; 1363</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-content">
              <h2>Traveler Reviews</h2>
              <div className="review-form-box">
                <h3>{user ? 'Share your experience' : 'Sign in to write a review'}</h3>
                {user ? (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label>Rating</label>
                      <StarPicker value={reviewForm.rating} onChange={r => setReviewForm({...reviewForm, rating: r})} />
                    </div>
                    <div className="form-group">
                      <label>Your review</label>
                      <textarea rows={4} placeholder="What was your experience like?"
                        value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-terra" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit review'}
                    </button>
                  </form>
                ) : (
                  <div className="login-prompt">
                    <Link to="/login" className="btn-primary">Sign in to review</Link>
                  </div>
                )}
              </div>
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p style={{color:'var(--stone)',textAlign:'center',padding:'40px',fontSize:'0.875rem'}}>
                    No reviews yet. Be the first to share your experience.
                  </p>
                ) : reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">{review.user_name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div className="reviewer-name">{review.user_name}</div>
                        <div className="review-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                      </div>
                      <div className="review-date">
                        {new Date(review.created_at).toLocaleDateString('en-IN', { month:'short', year:'numeric' })}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
