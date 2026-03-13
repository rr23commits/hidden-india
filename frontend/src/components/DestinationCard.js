import React from 'react';
import { Link } from 'react-router-dom';
import './DestinationCard.css';

const DestinationCard = ({ destination }) => {
  const tags = destination.tags ? destination.tags.split(',').slice(0, 2) : [];
  const imageUrl = destination.image_url || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80';

  return (
    <Link to={`/destination/${destination.id}`} className="dcard">
      <div className="dcard-img">
        <img
          src={imageUrl}
          alt={destination.name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80'; }}
        />
        <div className="dcard-img-overlay" />
        <div className="dcard-state">{destination.state}</div>
      </div>
      <div className="dcard-body">
        <div className="dcard-top">
          <h3 className="dcard-name">{destination.name}</h3>
          <div className="dcard-rating">
            <span className="dcard-star">&#9733;</span>
            <span>{Number(destination.rating).toFixed(1)}</span>
          </div>
        </div>
        <p className="dcard-desc">{destination.description?.substring(0, 95)}...</p>
        <div className="dcard-footer">
          <div className="dcard-tags">
            {tags.map((tag, i) => <span key={i} className="tag">{tag.trim()}</span>)}
          </div>
          <span className="dcard-link">Explore</span>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
