import { motion } from 'framer-motion';
import HeroSection from '../components/sections/HeroSection';
import ProductSection from '../components/sections/ProductSection';
import PromotionBanners from '../components/sections/PromotionBanners';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import PartnersSection from '../components/sections/PartnersSection';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const HomePage = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* ✅ Background animation layer */}
      <AnimatedBackground />

      {/* ✅ Foreground content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <ProductSection />
        <PromotionBanners />
        <TestimonialsSection />
        <PartnersSection />
      </motion.div>
    </div>
  );
};

export default HomePage;
