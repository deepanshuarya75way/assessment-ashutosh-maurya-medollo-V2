import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      image: 'https://placehold.co/300x300/24AEB1/FFFFFF/png?text=R',
      rating: 5,
      testimonial: 'I\'ve been using Medollo for all my medication needs for the past year. The delivery is always on time and the prices are much better than my local pharmacy. Highly recommend!',
      location: 'Mumbai, Maharashtra'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      image: 'https://placehold.co/300x300/FF385C/FFFFFF/png?text=P',
      rating: 4,
      testimonial: 'Medollo has made it so convenient to order medications for my parents who live in another city. Their customer service is excellent and they always verify prescriptions thoroughly.',
      location: 'Bangalore, Karnataka'
    },
    {
      id: 3,
      name: 'Arun Patel',
      image: 'https://placehold.co/300x300/001E42/FFFFFF/png?text=A',
      rating: 5,
      testimonial: 'Very reliable service! I\'ve received genuine products every time and their discounts are amazing. The app is also very easy to use, even for seniors like me.',
      location: 'Delhi, NCR'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-darkblue mb-2">Hear From Our Happy Customers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what our customers have to say about their experience with Medollo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: index === activeIndex ? -10 : 0
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ y: -10 }}
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 relative"
              >
                {/* Quotation Mark */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                  "
                </div>

                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-secondary"
                  />
                  <div>
                    <h4 className="font-semibold text-lg text-darkblue">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-600 italic mb-4">"{testimonial.testimonial}"</p>

                <div className="text-secondary font-medium text-sm">Verified Purchase</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === activeIndex ? 'bg-primary scale-125' : 'bg-gray-300'
              } transition-all duration-300`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-secondary text-secondary font-medium px-6 py-2 rounded-md hover:bg-secondary hover:text-white transition-colors"
          >
            View All Testimonials
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;