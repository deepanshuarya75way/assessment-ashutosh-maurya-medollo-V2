import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";
import Medical from '../assets/med.gif'
const Footer = () => {
  const categories = [
    { name: 'About Medollo', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const topMedicines = [
    { name: 'Diabetes Care', path: '/category/diabetes-care' },
    { name: 'Pain Relief', path: '/category/pain-relief' },
    { name: 'Heart Health', path: '/category/heart-health' },
    { name: 'Vitamins & Nutrition', path: '/category/vitamins-nutrition' },
    { name: 'Skin Care', path: '/category/skin-care' },
    { name: 'Fever & Cold', path: '/category/fever-cold' }
  ];

  const topCategories = [
    { name: 'Ayurvedic', path: '/category/ayurvedic' },
    { name: 'Homeopathic', path: '/category/homeopathic' },
    { name: 'Allopathic', path: '/category/allopathic' },
    { name: 'Personal Care', path: '/category/personal-care' },
    { name: 'Devices', path: '/category/devices' },
    { name: 'Baby Products', path: '/category/baby-products' }
  ];
  const socialLinks = [
    { icon: <FaFacebook className="w-5 h-5" />, url: 'https://facebook.com' },
    { icon: <FaXTwitter className="w-5 h-5" />, url: 'https://twitter.com' },
    { icon: <FaInstagram className="w-5 h-5" />, url: 'https://instagram.com' },
    { icon: <FaLinkedin className="w-5 h-5" />, url: 'https://linkedin.com' }
  ];

  return (
    <footer className="bg-darkblue text-white pt-12 pb-6">
      <div className="container-custom">
        

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">Medollo</h2>
            <p className="text-gray-400 mb-4">
              India's most trusted online pharmacy & healthcare platform. We deliver quality medicines and healthcare products at affordable prices.
            </p>
            {/* <div className="flex space-x-3">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <motion.a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 text-white">
                    {social[0].toUpperCase()}
                  </div>
                </motion.a>
              ))}
            </div> */}
             <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={category.path}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Top Medicines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Top Medicines</h3>
            <ul className="space-y-2">
              {topMedicines.map((medicine, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={medicine.path}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {medicine.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Top Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
            <ul className="space-y-2">
              {topCategories.map((category, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={category.path}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Mobile App Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Download Medollo App</h3>
              <p className="text-gray-400 mb-4">
                Get flat 10% off on medicines, free delivery, and enjoy cashback on orders above ₹999
              </p>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="bg-black rounded-lg px-4 py-2 flex items-center"
                >
                  <div className="mr-2 text-xl">📱</div>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="bg-black rounded-lg px-4 py-2 flex items-center"
                >
                  <div className="mr-2 text-xl">🤖</div>
                  <div>
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </motion.a>
              </div>
            </div>
            <div className="flex justify-end">
              <motion.img
                whileHover={{ y: -10 }}
                src={Medical}
                alt="Medollo Mobile App"
                className="max-h-40"
              />
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} Medollo. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-primary">Sitemap</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;