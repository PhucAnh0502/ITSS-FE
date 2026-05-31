import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Wifi, Plug, Snowflake, Projector, ParkingCircle } from 'lucide-react';
import { useWorkspace } from '../hooks/useWorkspace';
import { useReviews } from '../hooks/useReviews';
import { LOCALIZATION } from '../utils/localization';
import StarRating from '../components/StarRating';
import StatusBadge from '../components/StatusBadge';
import ReviewCard from '../components/ReviewCard';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import './DetailPage.css';

/**
 * Amenity icon mapping for display.
 */
const amenityIcons = {
  wifi: { icon: Wifi, label: LOCALIZATION.amenityLabels.wifi },
  power: { icon: Plug, label: LOCALIZATION.amenityLabels.power },
  ac: { icon: Snowflake, label: LOCALIZATION.amenityLabels.ac },
  projector: { icon: Projector, label: LOCALIZATION.amenityLabels.projector },
  parking: { icon: ParkingCircle, label: LOCALIZATION.amenityLabels.parking },
};

/**
 * Returns today's business hours string for a workspace.
 */
function getTodayHours(businessHours) {
  if (!businessHours) return LOCALIZATION.misc.noInfo;
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const hours = businessHours[today];
  if (!hours || hours.open === 'closed') return LOCALIZATION.misc.closedToday;
  return `${hours.open} - ${hours.close}`;
}

/**
 * DetailPage - Displays comprehensive workspace information including photos,
 * details, reviews preview, and action buttons.
 */
function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workspace, loading: wsLoading, error: wsError } = useWorkspace(id);
  const { reviews, loading: revLoading } = useReviews(id);
  const [showModal, setShowModal] = useState(false);

  // Loading state
  if (wsLoading) {
    return (
      <div className="detail-page">
        <LoadingIndicator />
      </div>
    );
  }

  // Error state
  if (wsError || !workspace) {
    return (
      <div className="detail-page">
        <ErrorMessage message={wsError || LOCALIZATION.errors.workspaceNotFound} />
      </div>
    );
  }

  const previewReviews = reviews.slice(0, 3);

  const handleReserve = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(workspace.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleSeeAllReviews = () => {
    navigate(`/reviews/${id}`);
  };

  return (
    <div className="detail-page">
      {/* Photo Gallery */}
      <section className="detail-page__gallery">
        <div className="detail-page__hero">
          <img
            className="detail-page__hero-img"
            src={workspace.photos?.[0]}
            alt={workspace.name}
          />
        </div>
        <div className="detail-page__thumbnails">
          {workspace.photos?.[1] && (
            <img
              className="detail-page__thumbnail"
              src={workspace.photos[1]}
              alt={`${workspace.name} 写真2`}
            />
          )}
          {workspace.photos?.[2] && (
            <img
              className="detail-page__thumbnail"
              src={workspace.photos[2]}
              alt={`${workspace.name} 写真3`}
            />
          )}
        </div>
      </section>

      {/* Workspace Info */}
      <section className="detail-page__info">
        <h1 className="detail-page__name">{workspace.name}</h1>
        {workspace.nameJa && <p className="detail-page__name-ja">{workspace.nameJa}</p>}
        <span className="detail-page__category">{workspace.categoryLabelJa}</span>

        <div className="detail-page__rating">
          <StarRating rating={workspace.rating} count={workspace.reviewCount} />
        </div>

        <div className="detail-page__meta">
          <div className="detail-page__meta-item">
            <MapPin size={16} className="detail-page__meta-icon" />
            <span className="detail-page__meta-text">{workspace.address}</span>
          </div>
          <div className="detail-page__meta-item">
            <Clock size={16} className="detail-page__meta-icon" />
            <span className="detail-page__meta-text">
              {LOCALIZATION.misc.today}: {getTodayHours(workspace.businessHours)}
            </span>
          </div>
        </div>

        <div className="detail-page__availability">
          <StatusBadge status={workspace.availability} />
        </div>
      </section>

      {/* Amenities */}
      <section className="detail-page__amenities">
        <h2 className="detail-page__section-title">{LOCALIZATION.headings.amenities}</h2>
        <div className="detail-page__amenities-list">
          {workspace.amenities?.map((amenity) => {
            const config = amenityIcons[amenity];
            if (!config) return null;
            const IconComponent = config.icon;
            return (
              <div key={amenity} className="detail-page__amenity-item">
                <IconComponent size={18} className="detail-page__amenity-icon" />
                <span className="detail-page__amenity-label">{config.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reviews Preview */}
      <section className="detail-page__reviews">
        <div className="detail-page__reviews-header">
          <h2 className="detail-page__section-title">{LOCALIZATION.headings.communityReviews}</h2>
          {reviews.length > 0 && (
            <button
              className="detail-page__see-all"
              onClick={handleSeeAllReviews}
            >
              {LOCALIZATION.misc.seeAll}
            </button>
          )}
        </div>
        {revLoading ? (
          <LoadingIndicator />
        ) : previewReviews.length === 0 ? (
          <p className="detail-page__no-reviews">{LOCALIZATION.misc.noReviewsYet}</p>
        ) : (
          <div className="detail-page__reviews-list">
            {previewReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* Action Buttons */}
      <section className="detail-page__actions">
        <button
          className="detail-page__btn detail-page__btn--reserve"
          onClick={handleReserve}
        >
          {LOCALIZATION.buttons.reserve}
        </button>
        <button
          className="detail-page__btn detail-page__btn--directions"
          onClick={handleGetDirections}
        >
          {LOCALIZATION.buttons.getDirections}
        </button>
      </section>

      {/* Reservation Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="detail-page__modal-overlay"
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-label={LOCALIZATION.misc.reservationConfirm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="detail-page__modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="detail-page__modal-message">{LOCALIZATION.misc.reservationComplete}</p>
              <button
                className="detail-page__modal-close"
                onClick={handleCloseModal}
              >
                {LOCALIZATION.misc.close}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DetailPage;
