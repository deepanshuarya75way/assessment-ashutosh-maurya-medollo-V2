import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';
import CartSidebar from '../components/CartSidebar';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const MainLayout = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-screen"
    >
      <AnimatedBackground />
     
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <CartSidebar />
    </motion.div>
  );
};

export default MainLayout;