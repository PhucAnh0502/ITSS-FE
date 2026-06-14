import { motion, AnimatePresence } from 'framer-motion';

/**
 * TransitionWrapper applies framer-motion animations based on navigation direction.
 *
 * Props:
 * - direction: "slide-left" | "slide-right" | "fade"
 * - children: React children to wrap with the animation
 * - locationKey: triggers re-animation on route change
 */

const variants = {
  'slide-left': {
    initial: { x: '100%', opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-30%', opacity: 0 },
  },
  'slide-right': {
    initial: { x: '-100%', opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '30%', opacity: 0 },
  },
  fade: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
};

function TransitionWrapper({ direction = 'fade', children, locationKey }) {
  const variant = variants[direction] || variants.fade;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locationKey}
        className="w-full min-h-full"
        initial={variant.initial}
        animate={variant.animate}
        exit={variant.exit}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default TransitionWrapper;
