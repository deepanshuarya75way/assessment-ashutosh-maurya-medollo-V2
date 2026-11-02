
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon, UserPlusIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/ui/PageTransition';
import OTPVerification from '../components/ui/OTPVerification';
import { useCart } from '../context/CartContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useCart();
  
  // Get returnUrl from query parameters if available
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get('returnUrl');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('form'); // 'form' or 'otp'
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Password validation requirements
  const passwordRequirements = [
    { name: 'length', label: 'At least 8 characters', valid: formData.password.length >= 8 },
    { name: 'lowercase', label: 'One lowercase letter', valid: /[a-z]/.test(formData.password) },
    { name: 'uppercase', label: 'One uppercase letter', valid: /[A-Z]/.test(formData.password) },
    { name: 'number', label: 'One number', valid: /[0-9]/.test(formData.password) },
    { name: 'special', label: 'One special character', valid: /[^a-zA-Z0-9]/.test(formData.password) },
  ];
    useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); // or whatever your dashboard route is
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSendOTP = async () => {
    setError('');
    setIsLoading(true);

    if (!formData.phone) {
      setError('Please enter your phone number');
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep('otp');
        setSuccessMessage('OTP sent successfully!');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsPhoneVerified(true);
        setSuccessMessage('Phone number verified successfully!');
        // Proceed with registration
        handleSignup();
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('OTP resent successfully!');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };


  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate form
    if (!formData.name || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const passwordIsValid = passwordRequirements.every(req => req.valid);
    if (!passwordIsValid) {
      setError('Password does not meet all requirements');
      return;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || undefined,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully! Redirecting...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user);
        setTimeout(() => {
          setIsLoading(false);
          navigate(returnUrl || '/');
        }, 1500);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };
  return (
    <PageTransition>
      <div className="bg-pink-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {currentStep === 'otp' ? (
          <OTPVerification
            phone={formData.phone}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            onBack={() => setCurrentStep('form')}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
          />
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 relative">
            {/* Back button */}
            <div className="absolute top-4 left-4">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-primary transition-colors flex items-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">Back</span>
              </button>
            </div>
            
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
                <UserPlusIcon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
              <p className="mt-2 text-gray-600">Join Medollo for faster checkouts and personalized services</p>
            </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}
          
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="9876543210"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password requirements */}
              {formData.password.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700 mb-1">Password Requirements:</p>
                  <ul className="grid grid-cols-2 gap-1">
                    {passwordRequirements.map((req) => (
                      <li key={req.name} className="flex items-center text-xs">
                        {req.valid ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-gray-300 mr-1" />
                        )}
                        <span className={req.valid ? "text-green-700" : "text-gray-500"}>
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary focus:border-primary"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP & Continue'}
              </button>
            </div>
          </form>
          
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default SignupPage;