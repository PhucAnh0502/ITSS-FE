import React from 'react';
import { Heart, MapPin, Star } from 'lucide-react';
import './WorkspaceCard.css';

const statusConfig = {
  available: { label: '空席あり', className: 'workspace-card__badge--available' },
  busy: { label: '満席', className: 'workspace-card__badge--busy' },
  closed: { label: '閉店', className: 'workspace-card__badge--closed' },
};

function CardStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.closed;
  return (
    <span className={`workspace-card__badge ${config.className}`}>
      {config.label}
    </span>
  );
}

export default function WorkspaceCard({ workspace, onClick }) {
  if (!workspace) return null;

  const {
    photos = [],
    name = '',
    address = '',
    availability = 'closed',
    rating = 0,
    description = '',
    featureTags = [],
  } = workspace;

  const photoUrl = photos[0] || '';
  const displayTags = featureTags.slice(0, 5);
  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : '0.0';

  return (
    <article
      className="workspace-card"
      onClick={() => onClick && onClick(workspace)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick(workspace);
        }
      }}
    >
      <div className="workspace-card__image-container">
        {photoUrl ? (
          <img
            className="workspace-card__image"
            src={photoUrl}
            alt={name || 'ワークスペース'}
            loading="lazy"
          />
        ) : (
          <div className="workspace-card__image-placeholder" aria-label="写真なし" />
        )}
        {/* Favorite heart icon */}
        <button
          className="workspace-card__favorite"
          onClick={(e) => e.stopPropagation()}
          aria-label="お気に入り"
        >
          <Heart size={16} />
        </button>
        {/* Status badge on bottom-left of photo */}
        <CardStatusBadge status={availability} />
      </div>

      <div className="workspace-card__content">
        {/* Name + Rating row */}
        <div className="workspace-card__title-row">
          <h3 className="workspace-card__name">{name}</h3>
          <span className="workspace-card__rating">
            <Star size={14} className="workspace-card__rating-star" fill="#f59e0b" stroke="#f59e0b" />
            <span className="workspace-card__rating-value">{displayRating}</span>
          </span>
        </div>

        {/* Location */}
        <p className="workspace-card__location">
          <MapPin size={14} className="workspace-card__pin-icon" aria-hidden="true" />
          {address}
        </p>

        {/* Description */}
        {description && (
          <p className="workspace-card__description">{description}</p>
        )}

        {/* Feature tags */}
        {displayTags.length > 0 && (
          <div className="workspace-card__tags">
            {displayTags.map((tag, index) => (
              <span key={index} className="workspace-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
