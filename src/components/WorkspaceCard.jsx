import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star } from 'lucide-react';
import { LOCALIZATION } from '../utils/localization';

const statusDot = {
  available: 'bg-green-400',
  busy: 'bg-orange-400',
  closed: 'bg-gray-300',
};

const statusLabels = {
  available: LOCALIZATION.status.available,
  busy: LOCALIZATION.status.busy,
  closed: LOCALIZATION.status.closed,
};

/** Pill rendered over the image gradient: a colored dot + status text in white. */
function StatusPill({ status }) {
  const dot = statusDot[status] || statusDot.closed;
  const label = statusLabels[status] || statusLabels.closed;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md text-[0.7rem] font-semibold text-white tracking-wide">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

/** Heart favourite toggle with a "pop" micro-interaction on tap. */
function FavoriteButton({ featured }) {
  const [fav, setFav] = useState(false);
  return (
    <motion.button
      className={`absolute top-3 right-3 ${featured ? 'w-10 h-10' : 'w-8 h-8'} rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center cursor-pointer border-none shadow-sm hover:bg-white transition-colors`}
      onClick={(e) => {
        e.stopPropagation();
        setFav((v) => !v);
      }}
      aria-label="お気に入り"
      aria-pressed={fav}
      whileTap={{ scale: 0.8 }}
      animate={fav ? { scale: [1, 1.35, 1] } : { scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Heart
        size={featured ? 18 : 16}
        className={fav ? 'text-rose-500' : 'text-rose-400'}
        fill={fav ? '#f43f5e' : 'none'}
      />
    </motion.button>
  );
}

export default function WorkspaceCard({ workspace, onClick, featured = false }) {
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
  const displayTags = featureTags.slice(0, 3);
  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : '0.0';

  const handleActivate = () => onClick && onClick(workspace);
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(workspace);
    }
  };

  // FEATURED: full-bleed image with all content overlaid on the gradient.
  if (featured) {
    return (
      <article
        className="group relative h-full min-h-[420px] rounded-3xl overflow-hidden cursor-pointer ring-1 ring-violet-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/25 focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:outline-offset-2"
        onClick={handleActivate}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {photoUrl ? (
          <img
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            src={photoUrl}
            alt={name || 'ワークスペース'}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-violet-100" aria-label="写真なし" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Featured ribbon */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-gradient text-white text-[0.7rem] font-bold tracking-wide shadow-sm">
          ★ {LOCALIZATION.hero.featured}
        </span>
        <FavoriteButton featured />

        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2 text-white">
          <StatusPill status={availability} />
          <h3 className="text-2xl font-extrabold leading-tight drop-shadow-sm line-clamp-2">{name}</h3>
          <div className="flex items-center gap-3 text-sm text-white/90">
            <span className="flex items-center gap-1 min-w-0">
              <MapPin size={15} className="text-fuchsia-300 shrink-0" aria-hidden="true" />
              <span className="truncate">{address}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0 font-semibold">
              <Star size={15} className="text-amber-400" fill="#fbbf24" stroke="#fbbf24" />
              {displayRating}
            </span>
          </div>
          {description && (
            <p className="text-sm text-white/80 leading-relaxed line-clamp-2">{description}</p>
          )}
          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {displayTags.map((tag, index) => (
                <span key={index} className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-medium text-white border border-white/50 backdrop-blur-sm whitespace-nowrap">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  }

  // STANDARD: edge-to-edge image with overlaid badges, details below.
  return (
    <article
      className="group relative h-full rounded-2xl overflow-hidden bg-white ring-1 ring-violet-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20 hover:ring-violet-300 cursor-pointer flex flex-col min-h-[420px] focus-visible:outline-2 focus-visible:outline-violet-500 focus-visible:outline-offset-2"
      onClick={handleActivate}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden shrink-0">
        {photoUrl ? (
          <img
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            src={photoUrl}
            alt={name || 'ワークスペース'}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-violet-100" aria-label="写真なし" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        <FavoriteButton />
        {/* Status + rating overlaid on the gradient */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <StatusPill status={availability} />
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/35 backdrop-blur-md text-xs font-semibold text-white">
            <Star size={13} className="text-amber-400" fill="#fbbf24" stroke="#fbbf24" />
            {displayRating}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1 overflow-hidden">
        <h3 className="text-base font-bold m-0 text-gray-900 leading-tight whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-violet-700 transition-colors">{name}</h3>

        <p className="text-[0.8rem] text-gray-500 m-0 flex items-center gap-1">
          <MapPin size={14} className="text-fuchsia-500 shrink-0" aria-hidden="true" />
          <span className="truncate">{address}</span>
        </p>

        {description && (
          <p className="text-[0.8rem] text-gray-600 m-0 leading-relaxed line-clamp-2">{description}</p>
        )}

        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1.5">
            {displayTags.map((tag, index) => (
              <span key={index} className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-medium text-gray-600 border border-gray-200 whitespace-nowrap shrink-0">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
