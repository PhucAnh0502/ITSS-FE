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
      <div className="px-4 pb-8 text-left max-w-3xl mx-auto">
        <LoadingIndicator />
      </div>
    );
  }

  // Error state
  if (wsError || !workspace) {
    return (
      <div className="px-4 pb-8 text-left max-w-3xl mx-auto">
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
    <div className="px-4 pb-8 text-left max-w-3xl mx-auto">
      {/* Photo Gallery */}
      <section className="-mx-4 mb-6 md:mx-0">
        <div className="w-full aspect-[4/3] overflow-hidden rounded-b-xl md:rounded-xl">
          <img
            className="w-full h-full object-cover block"
            src={workspace.photos?.[0]}
            alt={workspace.name}
          />
        </div>
        <div className="flex gap-2 mt-2 px-4 md:px-0">
          {workspace.photos?.[1] && (
            <img
              className="flex-1 aspect-[4/3] object-cover rounded-lg max-h-[120px] md:max-h-[160px]"
              src={workspace.photos[1]}
              alt={`${workspace.name} 写真2`}
            />
          )}
          {workspace.photos?.[2] && (
            <img
              className="flex-1 aspect-[4/3] object-cover rounded-lg max-h-[120px] md:max-h-[160px]"
              src={workspace.photos[2]}
              alt={`${workspace.name} 写真3`}
            />
          )}
        </div>
      </section>

      {/* Workspace Info */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold m-0 mb-1 text-brand-gradient tracking-tight">{workspace.name}</h1>
        {workspace.nameJa && <p className="text-sm text-gray-500 m-0 mb-2">{workspace.nameJa}</p>}
        <span className="inline-block bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-xl mb-3">{workspace.categoryLabelJa}</span>

        <div className="mb-4">
          <StarRating rating={workspace.rating} count={workspace.reviewCount} />
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} className="shrink-0" />
            <span className="leading-snug">{workspace.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} className="shrink-0" />
            <span className="leading-snug">
              {LOCALIZATION.misc.today}: {getTodayHours(workspace.businessHours)}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <StatusBadge status={workspace.availability} />
        </div>
      </section>

      {/* Amenities */}
      <section className="mb-6 pt-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 m-0 mb-3">{LOCALIZATION.headings.amenities}</h2>
        <div className="flex flex-wrap gap-3">
          {workspace.amenities?.map((amenity) => {
            const config = amenityIcons[amenity];
            if (!config) return null;
            const IconComponent = config.icon;
            return (
              <div key={amenity} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm ring-1 ring-blue-100">
                <IconComponent size={18} className="text-cyan-500" />
                <span className="font-medium">{config.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reviews Preview */}
      <section className="mb-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 m-0">{LOCALIZATION.headings.communityReviews}</h2>
          {reviews.length > 0 && (
            <button
              className="bg-transparent border-none text-blue-600 text-sm font-medium cursor-pointer px-2 py-1 rounded transition-colors hover:bg-blue-500/10"
              onClick={handleSeeAllReviews}
            >
              {LOCALIZATION.misc.seeAll}
            </button>
          )}
        </div>
        {revLoading ? (
          <LoadingIndicator />
        ) : previewReviews.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">{LOCALIZATION.misc.noReviewsYet}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {previewReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* Action Buttons */}
      <section className="flex gap-3 pt-4 border-t border-gray-200 md:max-w-[400px]">
        <button
          className="flex-1 py-3.5 px-5 border-none rounded-xl text-base font-semibold cursor-pointer transition-all active:scale-[0.97] bg-brand-gradient text-white shadow-lg shadow-blue-500/30 hover:opacity-90"
          onClick={handleReserve}
        >
          {LOCALIZATION.buttons.reserve}
        </button>
        <button
          className="flex-1 py-3.5 px-5 rounded-xl text-base font-semibold cursor-pointer transition-all active:scale-[0.97] bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200"
          onClick={handleGetDirections}
        >
          {LOCALIZATION.buttons.getDirections}
        </button>
      </section>

      {/* Reservation Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
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
              className="bg-slate-50 rounded-2xl py-8 px-6 text-center max-w-[320px] w-[90%] shadow-lg"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-lg font-semibold text-gray-900 m-0 mb-5">{LOCALIZATION.misc.reservationComplete}</p>
              <button
                className="bg-brand-gradient text-white border-none rounded-lg px-6 py-2.5 text-sm font-medium cursor-pointer transition-opacity hover:opacity-90"
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
