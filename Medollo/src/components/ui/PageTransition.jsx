import { motion } from 'framer-motion';

// Default page transition configuration
const defaultTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.4
  }
};

// Slide transitions
const slideTransition = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: {
    type: 'spring',
    stiffness: 100,
    damping: 20
  }
};

// Fade transitions
const fadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.6
  }
};

// Scale transitions
const scaleTransition = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.1 },
  transition: {
    type: 'spring',
    stiffness: 200,
    damping: 20
  }
};

// Page transition component with animation
const PageTransition = ({ children, variant = 'default' }) => {
  let animationProps;
  
  // Select animation variant
  switch (variant) {
    case 'slide':
      animationProps = slideTransition;
      break;
    case 'fade':
      animationProps = fadeTransition;
      break;
    case 'scale':
      animationProps = scaleTransition;
      break;
    default:
      animationProps = defaultTransition;
  }

  return (
    <motion.div
      initial={animationProps.initial}
      animate={animationProps.animate}
      exit={animationProps.exit}
      transition={animationProps.transition}
      className="min-h-[80vh]"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;