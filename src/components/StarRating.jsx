import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, count }) {
  const stars = [];
  const roundedRating = Math.round(rating);

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={14}
        className={`star ${i <= roundedRating ? 'star--filled' : 'star--empty'}`}
        fill={i <= roundedRating ? '#f59e0b' : 'none'}
        stroke={i <= roundedRating ? '#f59e0b' : '#d1d5db'}
      />
    );
  }

  return (
    <span className="star-rating">
      <span className="star-rating__stars">{stars}</span>
      <span className="star-rating__value">{rating}</span>
      {count != null && (
        <span className="star-rating__count">({count}件)</span>
      )}
    </span>
  );
}
