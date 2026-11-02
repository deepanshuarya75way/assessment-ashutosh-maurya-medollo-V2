import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  DocumentTextIcon, 
  ShoppingCartIcon, 
  TruckIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const stepItems = [
    {
      id: 1,
      icon: <DocumentTextIcon className="w-8 h-8" />,
      title: 'Upload Prescription',
      description: 'Upload a valid prescription through our website or mobile app for verification by our pharmacists.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      icon: <ShoppingCartIcon className="w-8 h-8" />,
      title: 'Add to Cart & Checkout',
      description: 'Select your medicines, add them to cart, and proceed to a secure checkout process.',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      icon: <TruckIcon className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'We process your order quickly and deliver it to your doorstep within 24-48 hours.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 4,
      icon: <CheckCircleIcon className="w-8 h-8" />,
      title: 'Regular Refills',
      description: 'Set up auto-refills for chronic medications so you never miss a dose.',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  // Auto-advance steps with timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev % stepItems.length) + 1);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [stepItems.length]);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-darkblue mb-4">How Medollo Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting your medicines delivered is simple and convenient with our easy four-step process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left side: Steps */}
            <motion.div variants={itemVariants}>
              {/* Download Buttons */}
              <div className="mb-8 flex flex-col items-center md:items-start">
                <h3 className="text-lg font-semibold text-darkblue mb-4 text-center md:text-left">Download Our App</h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start w-full">
                  {/* Google Play Store Button */}
                  <motion.a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] text-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden min-w-[170px] max-w-[200px] justify-center md:justify-start border border-gray-700/50"
                  >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-2 left-2 w-8 h-8 border border-white rounded-full"></div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 border border-white rounded-full"></div>
                    </div>
                    
                    {/* Google Play Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                      </svg>
                    </div>
                    
                    {/* Text content */}
                    <div className="relative z-10 flex flex-col items-start min-w-0">
                      <span className="text-[9px] text-gray-400 uppercase tracking-wider font-medium leading-none mb-1">Get it on</span>
                      <span className="text-sm font-bold leading-tight text-white">Google Play</span>
                    </div>
                    
                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </motion.a>

                  {/* Apple App Store Button */}
                  <motion.a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] text-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden min-w-[170px] max-w-[200px] justify-center md:justify-start border border-gray-700/50"
                  >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-2 left-2 w-8 h-8 border border-white rounded-full"></div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 border border-white rounded-full"></div>
                    </div>
                    
                    {/* Apple Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05,20.28C14.75,21.87 13.35,21.78 11.83,21.18C10.22,20.55 8.78,20.5 7.06,21.28C5.5,22 4.5,21.78 3.5,21.28C2.33,20.67 0.25,18.78 1.89,14.5C2.89,12.28 3.94,10.11 6.5,10.06C8.06,10.03 9,11 10.11,11.11C11.33,11.22 12.47,10.14 14,10.17C15.64,10.2 16.69,10.39 17.69,11.61C14.22,13.72 14.83,18.39 17.05,20.28M12,8C12.5,7.03 12.86,5.85 12.75,4.61C11.58,4.72 10.11,5.45 9.25,6.42C8.72,7.11 8.22,8.28 8.36,9.39C9.67,9.5 10.94,8.78 12,8Z" />
                      </svg>
                    </div>
                    
                    {/* Text content */}
                    <div className="relative z-10 flex flex-col items-start min-w-0">
                      <span className="text-[9px] text-gray-400 uppercase tracking-wider font-medium leading-none mb-1">Download on the</span>
                      <span className="text-sm font-bold leading-tight text-white">App Store</span>
                    </div>
                    
                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </motion.a>
                </div>
              </div>

              <div className="space-y-8">
                {stepItems.map((step) => (
                  <div 
                    key={step.id}
                    className={`flex cursor-pointer group transition-all ${activeStep === step.id ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <div className={`flex-shrink-0 rounded-full p-4 mr-5 ${step.color}`}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center">
                        <span className="bg-darkblue text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-2">
                          {step.id}
                        </span>
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right side: Visual illustration */}
            <motion.div
              variants={itemVariants}
              className="relative flex flex-col md:space-y-4"
            >
              {/* Medicine image in a card */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                <div className="rounded-lg overflow-hidden flex justify-center">
                  <img 
                    src="https://t4.ftcdn.net/jpg/02/81/42/77/360_F_281427785_gfahY8bX4VYCGo6jlfO8St38wS9cJQop.jpg" 
                    alt="Medicine and prescription" 
                    className="max-w-full h-60 md:h-72"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="text-center mt-4">
                  <span className="text-darkblue font-medium text-sm bg-blue-50 px-3 py-1 rounded-full">100% Authentic Medications</span>
                </div>
              </div>
              
              {/* Mobile phone UI */}
              <div className="bg-white rounded-xl shadow-lg p-4 flex justify-center">
                {/* Mobile phone frame */}
                <div className="w-56 h-[350px] bg-darkblue rounded-3xl p-3 relative shadow-md">
                  {/* Screen */}
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                    {/* Status bar */}
                    <div className="h-6 bg-gray-100 flex items-center justify-between px-4">
                      <div className="text-xs font-medium">9:41</div>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-darkblue"></div>
                        <div className="w-3 h-3 rounded-full bg-darkblue"></div>
                        <div className="w-3 h-3 rounded-full bg-darkblue"></div>
                      </div>
                    </div>

                    {/* App content */}
                    <div className="p-4">
                      {/* App header */}
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xs">M</div>
                        <div className="ml-2 text-sm font-bold">Medollo</div>
                      </div>

                      {/* Content based on active step */}
                      <div className="animate-fade-in">
                        {activeStep === 1 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Upload Prescription</h4>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
                              <DocumentTextIcon className="w-12 h-12 text-primary mb-2" />
                              <span className="text-xs text-center">Tap to upload your prescription</span>
                            </div>
                            <div className="mt-4 bg-gray-100 rounded-lg p-3">
                              <div className="text-xxs">Accepted formats: JPG, PNG, PDF</div>
                              <div className="mt-1 bg-primary text-white text-xxs py-1 px-3 rounded w-max">Upload</div>
                            </div>
                          </div>
                        )}

                        {activeStep === 2 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Add to Cart</h4>
                            <div className="space-y-2">
                              {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center bg-gray-50 p-2 rounded-lg">
                                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                  <div className="ml-2 flex-grow">
                                    <div className="text-xxs font-medium">Medicine Item {item}</div>
                                    <div className="text-xxs text-primary">₹{(Math.random() * 100 + 50).toFixed(2)}</div>
                                  </div>
                                  <div className="bg-secondary text-white text-xxs py-1 px-2 rounded">Add</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-xs">Total (3 items)</span>
                              <span className="text-xs font-bold">₹349.97</span>
                            </div>
                            <div className="mt-2 bg-primary text-white text-center text-xs py-2 rounded">
                              Checkout Now
                            </div>
                          </div>
                        )}

                        {activeStep === 3 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Order Tracking</h4>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xxs font-medium">Order #MED58642</div>
                              <div className="text-xxs text-gray-500">Estimated delivery: Today, 6:30 PM</div>
                              <div className="my-4">
                                <div className="relative">
                                  <div className="absolute left-0 top-1/2 right-0 h-0.5 bg-gray-300 -translate-y-1/2"></div>
                                  <div className="absolute left-0 top-1/2 right-[40%] h-0.5 bg-primary -translate-y-1/2"></div>
                                  <div className="flex justify-between relative">
                                    <div>
                                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                                      <div className="text-xxs mt-1">Packed</div>
                                    </div>
                                    <div>
                                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                                      <div className="text-xxs mt-1">Shipped</div>
                                    </div>
                                    <div>
                                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                      <div className="text-xxs mt-1">Out for</div>
                                    </div>
                                    <div>
                                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                      <div className="text-xxs mt-1">Delivered</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center bg-blue-50 p-2 rounded-md">
                                <TruckIcon className="w-4 h-4 text-blue-500" />
                                <div className="ml-2 text-xxs">Your order is on the way!</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeStep === 4 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Subscription & Refills</h4>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xxs font-medium">Active Subscriptions</div>
                              <div className="mt-2 space-y-2">
                                <div className="bg-white p-2 rounded border border-gray-200">
                                  <div className="flex justify-between">
                                    <div className="text-xxs font-medium">Monthly BP Medicine</div>
                                    <div className="text-xxs bg-green-100 text-green-700 px-1 rounded">Active</div>
                                  </div>
                                  <div className="text-xxs text-gray-500">Next refill: 23 May</div>
                                  <div className="mt-1 h-1 bg-gray-200 rounded-full">
                                    <div className="w-3/4 h-1 bg-primary rounded-full"></div>
                                  </div>
                                </div>
                                <div className="bg-white p-2 rounded border border-gray-200">
                                  <div className="flex justify-between">
                                    <div className="text-xxs font-medium">Vitamins Pack</div>
                                    <div className="text-xxs bg-green-100 text-green-700 px-1 rounded">Active</div>
                                  </div>
                                  <div className="text-xxs text-gray-500">Next refill: 15 May</div>
                                  <div className="mt-1 h-1 bg-gray-200 rounded-full">
                                    <div className="w-1/2 h-1 bg-primary rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                              <button className="mt-3 w-full text-center text-xxs bg-secondary text-white py-1 rounded">
                                Manage Subscriptions
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phone button */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Discount Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-16 md:mt-20"
          >
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-3 p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    First Order Special Offer
                  </h3>
                  <div className="bg-white/20 inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-4">
                    Limited Time Offer
                  </div>
                  <p className="text-white/90 mb-4 md:pr-6">
                    Get <span className="font-bold text-white">25% OFF</span> on your first order when you download our app and sign up. Use promo code <span className="bg-white text-primary px-2 py-1 rounded font-mono font-bold">MEDOLLO25</span> at checkout.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-white text-primary font-medium px-6 py-2 rounded-md hover:bg-white/90 transition-all flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Download App
                    </button>
                    <button className="bg-white/20 text-white font-medium px-6 py-2 rounded-md hover:bg-white/30 transition-all">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="hidden md:block md:col-span-2 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-white/20 animate-pulse-slow"></div>
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/20 animate-pulse-slow" style={{animationDelay: "1s"}}></div>
                      <div className="bg-white rounded-full p-4 shadow-xl animate-bounce" style={{animationDuration: "2.5s"}}>
                        <div className="bg-primary rounded-full w-32 h-32 flex items-center justify-center text-white font-bold">
                          <div>
                            <div className="text-5xl leading-none">25%</div>
                            <div className="text-xl text-center">OFF</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <a 
              href="/download-app" 
              className="inline-block px-6 py-3 bg-darkblue text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
            >
              Download Our Mobile App
            </a>
            <p className="text-sm text-gray-500 mt-3">
              Available for iOS and Android devices
            </p>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;