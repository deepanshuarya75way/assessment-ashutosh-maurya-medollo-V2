import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const OTPVerification = ({ 
  phone, 
  onVerify, 
  onResend, 
  onBack, 
  isLoading = false, 
  error = '', 
  successMessage = '' 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  // Timer for resend button
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendTimer(60); // 60 seconds cooldown
    await onResend();
    setIsResending(false);
  };

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      {/* Back button */}
      {onBack && (
        <div className="absolute top-4 left-4">
          <button 
            onClick={onBack}
            className="text-gray-500 hover:text-primary transition-colors flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Back</span>
          </button>
        </div>
      )}
      
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 flex items-center justify-center rounded-full mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Verify Your Phone</h2>
        <p className="mt-2 text-gray-600">
          We've sent a 6-digit code to
        </p>
        <p className="font-medium text-gray-800">
          {formatPhone(phone)}
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
        >
          <div className="flex">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-l-4 border-green-500 p-4 mb-6"
        >
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
              isLoading || otp.join('').length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : 'Verify Code'}
          </button>
        </div>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 mb-2">
          Didn't receive the code?
        </p>
        <button
          onClick={handleResend}
          disabled={isResending || resendTimer > 0}
          className={`text-sm font-medium transition-colors ${
            isResending || resendTimer > 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-primary hover:text-primary-dark'
          }`}
        >
          {isResending ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          The code will expire in 30 minutes
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
