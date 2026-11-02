import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DeliveryStatusModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already seen the notification
    const hasSeenNotification = localStorage.getItem('medollo-delivery-notification-seen');
    
    if (!hasSeenNotification && !hasShown) {
      // Show notification after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as seen in localStorage
    localStorage.setItem('medollo-delivery-notification-seen', 'true');
  };

  const handleDontShowAgain = () => {
    setIsOpen(false);
    // Mark as permanently dismissed
    localStorage.setItem('medollo-delivery-notification-seen', 'permanent');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Important Notice</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                <strong>We're currently in testing phase!</strong>
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Medollo is currently under development and we are not yet delivering medicines. 
                This website is for testing purposes only.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>What you can do:</strong>
                </p>
                <ul className="text-blue-700 text-sm mt-2 space-y-1">
                  <li>• Browse our medicine catalog</li>
                  <li>• Test the search and filtering features</li>
                  <li>• Experience the user interface</li>
                  <li>• Provide feedback for improvements</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Got it!
              </button>
              <button
                onClick={handleDontShowAgain}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Don't show again
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Thank you for helping us test Medollo! 🚀
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeliveryStatusModal;
