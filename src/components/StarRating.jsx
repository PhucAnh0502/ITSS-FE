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
        className={i <= roundedRating ? 'text-amber-400' : 'text-gray-300'}
        fill={i <= roundedRating ? '#f59e0b' : 'none'}
        stroke={i <= roundedRating ? '#f59e0b' : '#d1d5db'}
      />
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="inline-flex gap-px">{stars}</span>
      <span className="font-semibold text-gray-900 ml-0.5">{rating}</span>
      {count != null && (
        <span className="text-gray-400 text-xs">({count}件)</span>
      )}
    </span>
  );
}
