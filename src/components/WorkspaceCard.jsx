import React from 'react';
import { Heart, MapPin, Star } from 'lucide-react';

const statusColors = {
  available: 'bg-green-500',
  busy: 'bg-orange-500',
  closed: 'bg-gray-400',
};

const statusLabels = {
  available: '空席あり',
  busy: '満席',
  closed: '閉店',
};

function CardStatusBadge({ status }) {
  const colorClass = statusColors[status] || statusColors.closed;
  const label = statusLabels[status] || statusLabels.closed;
  return (
    <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[0.7rem] font-bold text-white tracking-wide ${colorClass}`}>
      {label}
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
      className="rounded-2xl overflow-hidden bg-white ring-1 ring-violet-100 shadow-sm hover:shadow-xl hover:shadow-violet-500/15 hover:-translate-y-1 hover:ring-violet-300 transition-all cursor-pointer flex flex-col min-h-[420px] focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:outline-offset-2"
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
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl shrink-0">
        {photoUrl ? (
          <img
            className="w-full h-full object-cover"
            src={photoUrl}
            alt={name || 'ワークスペース'}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" aria-label="写真なし" />
        )}
        {/* Favorite heart icon */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center cursor-pointer border-none text-rose-500 hover:scale-110 hover:bg-white transition-all"
          onClick={(e) => e.stopPropagation()}
          aria-label="お気に入り"
        >
          <Heart size={16} />
        </button>
        {/* Status badge on bottom-left of photo */}
        <CardStatusBadge status={availability} />
      </div>

      <div className="p-3.5 px-4 pb-4 flex flex-col gap-1.5 flex-1 overflow-hidden">
        {/* Name + Rating row */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold m-0 text-gray-900 leading-tight flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{name}</h3>
          <span className="flex items-center gap-1 text-sm shrink-0">
            <Star size={14} className="text-amber-500" fill="#f59e0b" stroke="#f59e0b" />
            <span className="font-semibold text-gray-900">{displayRating}</span>
          </span>
        </div>

        {/* Location */}
        <p className="text-[0.8rem] text-gray-500 m-0 flex items-center gap-1">
          <MapPin size={14} className="text-fuchsia-500 shrink-0" aria-hidden="true" />
          {address}
        </p>

        {/* Description */}
        {description && (
          <p className="text-[0.8rem] text-gray-600 m-0 leading-relaxed line-clamp-2">{description}</p>
        )}

        {/* Feature tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {displayTags.map((tag, index) => (
              <span key={index} className="px-2.5 py-0.5 rounded-xl text-[0.7rem] font-medium text-violet-700 bg-violet-50 border border-violet-100 whitespace-nowrap shrink-0">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
