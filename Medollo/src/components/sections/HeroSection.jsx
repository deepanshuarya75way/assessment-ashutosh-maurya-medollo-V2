import { motion } from 'framer-motion';
import Delivery from "../../assets/medicine-delivery-animation.gif";
const HeroSection = () => {
  return (
    // <section className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] py-12 md:py-20">
   <section className="relative bg-transparent py-12 md:py-20 backdrop-blur-[1px]">


    <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <div className="max-w-lg">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-darkblue mb-4"
              >
                Order Medicine Online at India's Most Trusted Pharmacy
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center mb-6"
              >
                <div className="bg-primary text-white text-lg font-bold px-4 py-2 rounded-lg mr-4">
                  100% Safe Medicines
                </div>
                <div className="text-lg font-medium">From Trusted Stores</div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-gray-600 mb-8"
              >
                Get trusted medicines delivered to your doorstep with our secure online pharmacy. 
                All products are verified and quality-checked for your safety.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <button className="btn-primary mr-4">Order Now</button>
                <button className="text-secondary font-medium hover:underline">
                  Learn More
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -top-6 -right-6 bg-secondary text-white px-6 py-3 rounded-lg shadow-lg transform rotate-3">
                <span className="block text-sm font-medium">Save Extra</span>
                <span className="block text-3xl font-bold">₹100 OFF</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white p-6 rounded-3xl shadow-2xl"
              >
                <img
                  src={Delivery}
                  alt="Van Delivering medicines"
                  className="rounded-2xl w-full max-w-2xl"
                  style={{ minWidth: "320px" }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Advantages Banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="container-custom mt-16"
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-darkblue mb-4">The Medollo Advantage</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "🔍", title: "Genuine Products", desc: "100% Authentic" },
              { icon: "🚚", title: "Fast Delivery", desc: "Within 24 Hours" },
              { icon: "💰", title: "Best Prices", desc: "Guaranteed Savings" },
              { icon: "🛡️", title: "Safe & Secure", desc: "Encrypted Payments" },
              { icon: "🔄", title: "Easy Returns", desc: "Hassle-free Process" },
              { icon: "📞", title: "24/7 Support", desc: "Always Available" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-lightgray rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

