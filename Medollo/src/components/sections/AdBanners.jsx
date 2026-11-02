import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdBanners = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const ads = [
    {
      id: 1,
      title: "Paan Corner",
      description: "Your favourite paan shop is now online",
      cta: "Shop Now",
      bgColor: "from-green-500 to-emerald-600",
      textColor: "text-white",
      badge: "New",
      products: [
        { url: "https://images.unsplash.com/photo-1690109295675-236a8ae10fd5?w=120&h=120&fit=crop", size: 80, rotate: -8 },
        { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop", size: 70, rotate: 12 },
        { url: "https://images.unsplash.com/photo-1710983165044-0cc32d1aab4b?w=120&h=120&fit=crop", size: 75, rotate: -5 },
        { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&h=120&fit=crop", size: 65, rotate: 15 },
        { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&h=120&fit=crop", size: 70, rotate: -10 },
        { url: "https://images.unsplash.com/photo-1760787517754-c73c7ee1f077?w=120&h=120&fit=crop", size: 60, rotate: 8 }
      ]
    },
    {
      id: 2,
      title: "Fashion Hub",
      description: "Trendy clothes and accessories delivered to your door",
      cta: "Explore Now",
      bgColor: "from-pink-500 to-rose-600",
      textColor: "text-white",
      badge: "Sale",
      products: [
        { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop", size: 85, rotate: -12 },
        { url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=120&fit=crop", size: 75, rotate: 10 },
        { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=120&fit=crop", size: 70, rotate: -8 },
        { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=120&h=120&fit=crop", size: 65, rotate: 12 },
        { url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=120&h=120&fit=crop", size: 72, rotate: -6 }
      ]
    },
    {
      id: 3,
      title: "Electronics Store",
      description: "Latest gadgets and tech accessories at best prices",
      cta: "Shop Now",
      bgColor: "from-blue-500 to-indigo-600",
      textColor: "text-white",
      badge: "Hot",
      products: [
        { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop", size: 80, rotate: 8 },
        { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=120&h=120&fit=crop", size: 75, rotate: -10 },
        { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop", size: 70, rotate: 12 },
        { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop", size: 68, rotate: -8 },
        { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=120&h=120&fit=crop", size: 72, rotate: 6 }
      ]
    },
    {
      id: 4,
      title: "Grocery Mart",
      description: "Fresh vegetables, fruits and daily essentials delivered fresh",
      cta: "Order Now",
      bgColor: "from-orange-500 to-red-600",
      textColor: "text-white",
      badge: "Fresh",
      products: [
        { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&h=120&fit=crop", size: 82, rotate: -9 },
        { url: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=120&h=120&fit=crop", size: 76, rotate: 11 },
        { url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=120&h=120&fit=crop", size: 74, rotate: -7 },
        { url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=120&h=120&fit=crop", size: 70, rotate: 9 },
        { url: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=120&h=120&fit=crop", size: 68, rotate: -6 },
        { url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=120&h=120&fit=crop", size: 72, rotate: 8 }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [ads.length]);

  const nextAd = () => {
    setCurrentAd((prev) => (prev + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const closeAd = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative">
      {/* Main Ad Banner Carousel */}
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <motion.div
          className="flex"
          animate={{
            x: `-${currentAd * 100}%`
          }}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.5
          }}
        >
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`relative flex-shrink-0 w-full min-h-[220px] rounded-xl bg-gradient-to-r ${ad.bgColor}`}
            >

              <div className="relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                
                <div className="flex items-center p-8 relative z-10">
                  <div className="flex-1">
                    {/* Badge */}
                    {ad.badge && (
                      <span className="inline-block bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3 border border-white border-opacity-30">
                        {ad.badge}
                      </span>
                    )}
                    
                    <h3 className={`text-4xl font-extrabold mb-3 ${ad.textColor} drop-shadow-lg`}>
                      {ad.title}
                    </h3>
                    <p className={`text-lg mb-6 ${ad.textColor} opacity-95 leading-relaxed`}>
                      {ad.description}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl">
                        {ad.cta}
                      </button>
                      
                      {/* Additional info badges */}
                      <div className="flex gap-2">
                        <span className={`text-xs ${ad.textColor} opacity-80 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white border-opacity-30`}>
                          ✓ Verified
                        </span>
                        <span className={`text-xs ${ad.textColor} opacity-80 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white border-opacity-30`}>
                          🚚 Fast Delivery
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-8 relative w-72 h-48 overflow-visible flex items-center justify-center">
                    {ad.products.map((product, idx) => {
                      const positions = [
                        { x: 0, y: 15, rotate: -8 },
                        { x: 50, y: 0, rotate: 12 },
                        { x: 100, y: 25, rotate: -5 },
                        { x: 150, y: 8, rotate: 15 },
                        { x: 40, y: 70, rotate: -10 },
                        { x: 110, y: 65, rotate: 8 }
                      ];
                      const pos = positions[idx] || { x: 80, y: 40, rotate: 0 };
                      return (
                        <motion.img
                          key={idx}
                          src={product.url}
                          alt={`Product ${idx + 1}`}
                          className="absolute object-cover rounded-xl shadow-2xl border-2 border-white"
                          style={{
                            width: `${product.size}px`,
                            height: `${product.size}px`,
                            left: `${pos.x}px`,
                            top: `${pos.y}px`,
                            transform: `rotate(${pos.rotate}deg)`,
                            transformOrigin: 'center',
                            zIndex: idx + 1
                          }}
                          whileHover={{ scale: 1.1, rotate: pos.rotate + 5 }}
                          transition={{ duration: 0.2 }}
                        />
                      );
                    })}
                    
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full blur-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        <button
          onClick={prevAd}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors z-10"
        >
          <ChevronLeftIcon className="h-4 w-4 text-white" />
        </button>
        <button
          onClick={nextAd}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors z-10"
        >
          <ChevronRightIcon className="h-4 w-4 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAd(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentAd ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default AdBanners;
