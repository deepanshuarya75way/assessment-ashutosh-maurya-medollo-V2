import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ContactUsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // In a real app, you'd send the form data to your backend here
    console.log('Form submitted:', formData);
    
    // Show success message
    setSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };
  
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <PageTransition variant="default">
      <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-darkblue to-secondary text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Contact Us
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl opacity-90"
            >
              Have questions or feedback? We'd love to hear from you.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div 
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={containerVariants}
              className="md:col-span-1 space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-darkblue mb-6">Get In Touch</h2>
                <p className="text-gray-600 mb-8">
                  We're here to help and answer any questions you might have. 
                  We look forward to hearing from you.
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex items-start"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <MapPinIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkblue mb-1">Our Location</h3>
                  <address className="text-gray-600 not-italic">
                    Medollo Healthcare Pvt. Ltd.<br />
                    1234 Health Avenue, Tech Park<br />
                    Bengaluru, Karnataka 560001
                  </address>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex items-start"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <PhoneIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkblue mb-1">Call Us</h3>
                  <p className="text-gray-600">
                    Customer Support: +91 1800-123-4567<br />
                    Pharmacy Helpline: +91 1800-765-4321
                  </p>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex items-start"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <EnvelopeIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkblue mb-1">Email Us</h3>
                  <p className="text-gray-600">
                    General Inquiries: info@medollo.com<br />
                    Customer Support: support@medollo.com<br />
                    Business Inquiries: business@medollo.com
                  </p>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex items-start"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ClockIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-darkblue mb-1">Working Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday: 9:00 AM - 8:00 PM<br />
                    Sunday: 10:00 AM - 6:00 PM<br />
                    Customer Support: 24/7
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:col-span-2 bg-white p-8 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-bold text-darkblue mb-6">Send us a Message</h2>
              
              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6"
                >
                  <p className="font-medium">Thank you for contacting us!</p>
                  <p>Your message has been received. We'll get back to you shortly.</p>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Order Inquiry"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Please write your message here..."
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary text-white font-medium py-3 rounded-md hover:bg-primary/90 transition-all"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-xl overflow-hidden shadow-md"
            style={{ height: '400px' }}
          >
            {/* In a real app, you'd integrate Google Maps or another map provider here */}
            {/* For this demo, let's use a placeholder */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-12 w-12 mx-auto mb-2 text-primary" />
                <h3 className="text-xl font-semibold">Our Location</h3>
                <p>Medollo Healthcare, 1234 Health Avenue, Bengaluru</p>
                <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md">
                  View on Google Maps
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold text-darkblue mb-3"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-gray-600 max-w-xl mx-auto"
            >
              Find quick answers to commonly asked questions about our services.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              {
                q: "How do I place an order for medicines?",
                a: "You can place an order through our website or mobile app. Simply search for the medicines you need, add them to cart, and proceed to checkout. You'll need to upload a valid prescription for prescription medications."
              },
              {
                q: "What areas do you deliver to?",
                a: "We currently deliver to all major cities and many smaller towns across the country. You can check if we deliver to your area by entering your pin code on our website."
              },
              {
                q: "How long does delivery take?",
                a: "Delivery time depends on your location. In major cities, we offer same-day and next-day delivery options. For remote areas, it may take 2-3 business days."
              },
              {
                q: "Do you offer refunds if I'm not satisfied?",
                a: "Yes, we have a return and refund policy. If you receive damaged or incorrect products, you can request a return within 7 days of delivery. Refunds are processed within 5-7 business days."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-darkblue mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold mb-4"
            >
              Download Our Mobile App
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-xl mb-8 opacity-90"
            >
              Get the Medollo app for a seamless healthcare experience on the go.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.707 9.293l-5-5a1 1 0 00-1.414 0l-5 5a.999.999 0 101.414 1.414L12 5.414l4.293 4.293a.997.997 0 001.414 0 .999.999 0 000-1.414z"/>
                  <path d="M12 10a1 1 0 00-1 1v8a1 1 0 002 0v-8a1 1 0 00-1-1z"/>
                </svg>
                App Store
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3zm-4.59 13.41L12 18l-1.41-1.41L6.41 12 12 6.41l4.59 5.59-2.59 2.59 2.59 1.41 1.41-1.41z"/>
                </svg>
                Google Play
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  );
};

export default ContactUsPage;