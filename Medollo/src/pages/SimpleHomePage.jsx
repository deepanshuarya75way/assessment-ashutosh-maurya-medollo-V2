import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, ArrowRightIcon, TruckIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/ui/PageTransition';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import RandomMedicines from '../pages/HomePage/RandomMedicines';
import AdBanners from '../components/sections/AdBanners';
import CategoryPromoBanners from '../components/sections/CategoryPromoBanners';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import Delivery from "../assets/medicine-delivery-animation.gif";


const SimpleHomePage = () => {
  const [activeCategory, setActiveCategory] = useState('medicines');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  // Effect to trigger animations when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);


  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      text: 'The delivery was prompt, and the medicines were properly packaged. Excellent service!'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4,
      text: 'Very convenient for ordering medicines online. The discounts make it even better.'
    },
    {
      id: 3,
      name: 'Amit Patel',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      rating: 5,
      text: 'I ordered antibiotics for my child and received them in just 6 hours. Amazing service!'
    },
    {
      id: 4,
      name: 'Neha Verma',
      image: 'https://randomuser.me/api/portraits/women/63.jpg',
      rating: 5,
      text: 'The BP monitor I ordered works perfectly. Great quality products and quick delivery.'
    },
    {
      id: 5,
      name: 'Suresh Iyer',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      rating: 4,
      text: 'Good range of supplements available. Prices are better than local stores.'
    },
    {
      id: 6,
      name: 'Meera Gupta',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
      rating: 5,
      text: 'Been using Medollo for 6 months for my mother\'s regular medicines. Very reliable.'
    }
  ];

  const categories = [
    { id: 'medicines', name: 'Medicines' },
    { id: 'vitamins', name: 'Vitamins & Supplements' },
    { id: 'devices', name: 'Healthcare Devices' },
    { id: 'personal', name: 'Personal Care' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <PageTransition variant="fade">
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        {/* Quick Delivery Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white py-2 text-center text-sm font-medium">
          🚚 Free delivery in 10 minutes • Order now and get medicines delivered to your doorstep
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="order-2 md:order-1"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-darkblue mb-4">
                  Your Health Is Our <span className="text-primary">Priority</span>
                </h1>
                <p className="text-gray-600 mb-6">
                  Medollo provides 100% safe and genuine medicines delivered right to your doorstep.
                  Experience healthcare like never before with our wide range of products and services.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                    onClick={() => navigate('/products')}
                  >
                    Shop Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-secondary text-secondary rounded-md hover:bg-secondary hover:text-white transition-all"
                    onClick={() => navigate('/about')}
                  >
                    Learn More
                  </motion.button>
                </div>

                {/* First Two Feature Cards */}
                <motion.div
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  variants={containerVariants}
                  className="mt-6 grid grid-cols-2 gap-3"
                >
                  {[
                    { icon: "🏥", title: "Genuine Products", desc: "100% Authentic" },
                    { icon: "🚚", title: "Fast Delivery", desc: "Within 10 minutes" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="bg-gray-50 hover:scale-105 hover:shadow-lg rounded-lg p-3 md:p-4 text-center shadow-sm transition-all duration-100 hover:border-[0.5px]"
                    >
                      <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">{item.icon}</div>
                      <h3 className="text-sm md:text-base font-semibold mb-1 text-darkblue">{item.title}</h3>
                      <p className="text-xs md:text-sm text-gray-600">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.7 }}
                className="order-1 md:order-2"
              >





                <div className="relative flex justify-center lg:justify-end">
                  <div className="relative">
                    {/* Main delivery illustration */}
                    <div className="relative bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-3xl p-8 shadow-2xl ">
                      <div className='absolute top-0 left-0 rounded-3xl -z-10 h-full w-full bg-white'></div>
                      <img
                        src={Delivery}
                        alt="Fast Medicine Delivery"
                        className="w-full max-w-md rounded-2xl shadow-lg"
                      />

                      {/* Floating delivery badge */}
                      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl shadow-lg animate-bounce">
                        <div className="flex items-center space-x-2">
                          {/* <Zap className="h-4 w-4" /> */}
                          <span className="font-semibold text-sm">
                            10 min delivery
                          </span>
                        </div>
                      </div>

                      {/* Floating medicine icons */}
                      <div className="absolute -left-6 top-1/4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg animate-float">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        </div>
                      </div>

                      <div className="absolute -right-8 bottom-1/4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg animate-float-delayed">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery truck animation */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-2xl shadow-lg">
                      <div className="flex items-center space-x-2">
                        <TruckIcon className="h-4 w-4 animate-pulse" />
                        <span className="font-semibold text-sm">On the way!</span>
                      </div>
                    </div>
                  </div>
                  {/* Scroll Indicator */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
                      <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-pulse"></div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-3xl blur-3xl scale-110 -z-10"></div>
                  </div>
                </div>



              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Remaining Two Features */}
        {/* <section className="py-12 bg-white">
          <div className="container-custom">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
            >
              {[
                { icon: "💰", title: "Best Prices", desc: "Guaranteed Savings" },
                { icon: "🛡️", title: "Safe & Secure", desc: "Encrypted Payments" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 hover:scale-105 hover:shadow-lg rounded-lg p-6 text-center shadow-sm transition-all duration-100 hover:border-[0.5px]"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-darkblue">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section> */}

        {/* Ad Banners */}
        <section className="py-8 bg-white">
          <div className="container-custom">
            <AdBanners />
          </div>
        </section>





        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category Promotional Banners */}
              <CategoryPromoBanners />
            </motion.div>


          </div>
        </section>


        {/* Featured Products */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-darkblue mb-2"
              >
               Explore Medicine Categories
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-600 max-w-xl mx-auto"
              >
               Medollo is not just an online pharmacy in India; it's a complete healthcare destination. We make it easy for you to find and order medicines online from a wide range of product categories.
              </motion.p>
            </div>


            {/* Random Medicines  */}
            <RandomMedicines />


            <div className="text-center mt-10">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 4px 20px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className="relative flex items-center justify-center mx-auto px-6 py-3 space-x-2 rounded-full 
               bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
               text-white font-semibold tracking-wide transition-all duration-300"
              >
                <span className="z-10">View All Products</span>
                <ArrowRightIcon className="h-5 w-5 z-10" />
                <motion.span
                  className="absolute inset-0 rounded-full bg-white/10 blur-md"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.button>
            </div>

          </div>
        </section>


        {/* How It Works Section */}
        <HowItWorksSection />



        {/* Promotional Banner
      <section className="py-12 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Save Up To 60% On Your First Order</h3>
                <p className="mb-6 opacity-90">
                  Use code <span className="font-bold">MEDOLLO60</span> at checkout and get up to 60% off 
                  on your first order. Limited time offer.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary font-bold px-6 py-3 rounded-md hover:bg-opacity-90"
                  onClick={() => navigate('/products')}
                >
                  Shop Now
                </motion.button>
              </div>
              <div className="md:w-1/3 flex justify-end">
                <motion.img
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  src="https://placehold.co/300x300/FFFFFF/FF385C/png?text=60%+OFF"
                  alt="Promo"
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section> */}




        {/* Medicine Categories Section */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-darkblue mb-4">
                Featured Products
                  </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our top-selling healthcare products handpicked for you
                  
                </p>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-darkblue mb-3 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Prescription Medicines
                  </h3>
                  <p className="text-gray-600">
                    Prescription medicines require an authentic prescription slip. Upload your prescription and get genuine pharmacy medicines delivered.
                  </p>
                  <Link to="/categories/prescription" className="text-primary font-medium hover:underline block mt-3">View Prescription Medicines</Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-darkblue mb-3 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Over-the-Counter (OTC) Medicines
                  </h3>
                  <p className="text-gray-600">
                    Cough syrups, pain relievers, antacids and other medicines generally do not require a prescription for online medicine purchase.
                  </p>
                  <Link to="/categories/otc" className="text-primary font-medium hover:underline block mt-3">View OTC Medicines</Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-darkblue mb-3 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    Health and Nutrition Supplements
                  </h3>
                  <p className="text-gray-600">
                    Multivitamins, calcium, protein powder and immunity boosters for your overall well-being and healthier lifestyle.
                  </p>
                  <Link to="/categories/supplements" className="text-primary font-medium hover:underline block mt-3">View Health Supplements</Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-darkblue mb-3 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 019.07 4h5.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Personal Care Products
                  </h3>
                  <p className="text-gray-600">
                    From skincare essentials to daily hygiene products, we offer a complete range of personal care items for your everyday needs.
                  </p>
                  <Link to="/categories/personal-care" className="text-primary font-medium hover:underline block mt-3">View Personal Care</Link>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
                <h3 className="text-xl font-semibold text-darkblue mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h4l10 5z"></path>
                  </svg>
                  Healthcare for Chronic Conditions
                </h3>
                <p className="text-gray-600 mb-4">
                  For patients managing long-term treatments such as diabetes, hypertension, thyroid conditions or heart disease, switching to generic medicines online through Medollo can mean significant monthly savings without compromising on quality.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link to="/condition/diabetes" className="px-4 py-2 bg-gray-100 text-darkblue rounded-full hover:bg-primary hover:text-white transition-colors">Diabetes</Link>
                  <Link to="/condition/hypertension" className="px-4 py-2 bg-gray-100 text-darkblue rounded-full hover:bg-primary hover:text-white transition-colors">Hypertension</Link>
                  <Link to="/condition/thyroid" className="px-4 py-2 bg-gray-100 text-darkblue rounded-full hover:bg-primary hover:text-white transition-colors">Thyroid</Link>
                  <Link to="/condition/heart" className="px-4 py-2 bg-gray-100 text-darkblue rounded-full hover:bg-primary hover:text-white transition-colors">Heart Disease</Link>
                </div>
              </div>

              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary text-white px-8 py-3 rounded-md font-medium shadow-sm"
                  onClick={() => navigate('/prescriptions')}
                >
                  Upload Prescription
                </motion.button>
                <p className="text-sm text-gray-500 mt-3">
                  Fast medicine delivery across 20,000+ PIN codes in India
                </p>
              </div>
            </motion.div>


          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-darkblue mb-2"
              >
                What Our Customers Say
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-600 max-w-xl mx-auto"
              >
                Trusted by thousands of customers across the country
              </motion.p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  variants={itemVariants}
                  whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-center mb-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-semibold text-base">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic line-clamp-3">"{testimonial.text}"</p>
                </motion.div>
              ))}
            </motion.div>


          </div>
        </section>



        {/* CTA Section */}
        {/* <section className="py-12 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="bg-darkblue rounded-xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Healthcare Community</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Sign up for our newsletter and get exclusive health tips, offers, and updates 
              delivered directly to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section> */}
      </div>
    </PageTransition>
  );
};

export default SimpleHomePage;