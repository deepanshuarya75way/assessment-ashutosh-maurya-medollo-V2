import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    // Generate random dots
    const generateDots = () => {
      const newDots = [];
      for (let i = 0; i < 50; i++) {
        newDots.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          delay: Math.random() * 2 ,
          duration: Math.random() * 3 +2,
        });
      }
      setDots(newDots);
    };

    generateDots();
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Gradient background */}
     <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50" />

      
      {/* Animated dots */}
      
      {dots.map((dot) => (
  <motion.div
    key={dot.id}
    className="absolute rounded-full bg-gradient-to-r from-cyan-400/50 to-blue-400/20"
    style={{
      left: `${dot.x}%`,
      top: `${dot.y}%`,
      width: `${dot.size * 6}px`, // Slightly bigger base size
      height: `${dot.size * 6}px`,
    }}
    animate={{
      y: [0, -15, 0],
      x: [0, 8, 0],
      opacity: [0.3, 0.6, 0.3],
      scale: [0.8, 1.6, 0.8], // smoother, slower breathing
    }}
    transition={{
      duration: dot.duration * 2.5, // make overall motion slower
      delay: dot.delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
))}

      
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/20 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      <motion.div
        className="absolute top-24 right-20 w-16 h-16 border-2 border-secondary/50 rounded-lg"
        animate={{
          rotate: -360,
          y: [0, -15, 0],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-24 h-24 border border-primary/5 rounded-full"
        animate={{
          rotate: 180,
          scale: [1, 0.8, 1],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      {/* Subtle wave pattern */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/20 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;




