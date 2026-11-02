import { motion } from 'framer-motion';

const PromotionBanners = () => {
  return (
    <section className="py-12 bg-lightgray">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-bold text-darkblue mb-2">Special Offers & Promotions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take advantage of our limited-time deals and save on your healthcare needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Banner */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-pink-100 rounded-2xl overflow-hidden shadow-md"
          >
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center">
              <div className="md:w-7/12 mb-6 md:mb-0">
                <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                  FLAT 30% OFF
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-darkblue mb-2">
                  Stock Up On Immunity Boosters
                </h3>
                <p className="text-gray-700 mb-4">
                  Save up to 30% on all immunity boosting supplements and vitamins
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Shop Now
                </motion.button>
              </div>
              <div className="md:w-5/12 flex justify-center">
                <motion.img
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut"
                  }}
                  src="https://placehold.co/400x400/FF385C/FFFFFF/png?text=Immunity+Boosters"
                  alt="Immunity Boosters"
                  className="w-40 md:w-48 h-auto"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Banner */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-blue-100 rounded-2xl overflow-hidden shadow-md"
          >
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center">
              <div className="md:w-7/12 mb-6 md:mb-0">
                <span className="inline-block bg-secondary text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                  UP TO 50% OFF
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-darkblue mb-2">
                  Premium Healthcare Devices
                </h3>
                <p className="text-gray-700 mb-4">
                  Medical equipment and devices for home healthcare needs
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-all duration-300"
                >
                  Explore Now
                </motion.button>
              </div>
              <div className="md:w-5/12 flex justify-center">
                <motion.img
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6,
                    ease: "easeInOut"
                  }}
                  src="https://placehold.co/400x400/24AEB1/FFFFFF/png?text=Healthcare+Devices"
                  alt="Healthcare Devices"
                  className="w-40 md:w-48 h-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full Width Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          className="mt-6 bg-gradient-to-r from-darkblue to-secondary text-white rounded-2xl overflow-hidden shadow-lg"
        >
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl md:text-4xl font-bold mb-4">Save Up To 80% On Your Medication</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                    <span className="text-secondary font-bold">✓</span>
                  </div>
                  <span>100% Genuine Products</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                    <span className="text-secondary font-bold">✓</span>
                  </div>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                    <span className="text-secondary font-bold">✓</span>
                  </div>
                  <span>Extra 5% Cashback</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-darkblue font-bold px-8 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300"
            >
              Shop Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionBanners;