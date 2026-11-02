import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon, LockClosedIcon, UserIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/ui/PageTransition';
import OTPVerification from '../components/ui/OTPVerification';
import { useCart } from '../context/CartContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login,isLoggedIn  } = useCart();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState('phone'); // 'email' or 'phone'
  const [currentStep, setCurrentStep] = useState('form'); // 'form' or 'otp'
  
  // Get redirect location from state or URL params (if any)
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get('returnUrl');
  const from = returnUrl || location.state?.from || '/';
  const message = location.state?.message || '';

  useEffect(() => {
  if (isLoggedIn) {
    navigate('/'); // or whatever your dashboard route is
  }
}, [isLoggedIn, navigate]);




  
  // Show message if redirected from another page
  useEffect(() => {
    if (message) {
      setError(message);
    }
  }, [message]);
  

  const handleSendOTP = async () => {
    setError('');
    setIsLoading(true);

    if (!phone) {
      setError('Please enter your phone number');
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/[^0-9]/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
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
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Phone number verified successfully!');
        // If backend returns token/user, log the user in immediately
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          login(data.user);
          setTimeout(() => {
            setIsLoading(false);
            navigate(from);
          }, 800);
        } else {
          // Fallback: proceed with password login (legacy)
          handleLoginWithPhone();
        }
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
        body: JSON.stringify({ phone }),
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

  const handleLoginWithPhone = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Login successful! Redirecting...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user);

        setTimeout(() => {
          setIsLoading(false);
          navigate(from);
        }, 1000);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (loginMethod === 'phone') {
      if (!phone || !password) {
        setError('Please enter both phone number and password');
        setIsLoading(false);
        return;
      }

      if (!/^\d{10}$/.test(phone.replace(/[^0-9]/g, ''))) {
        setError('Please enter a valid 10-digit phone number');
        setIsLoading(false);
        return;
      }

      // For phone login, we need to verify OTP first
      await handleSendOTP();
      return;
    } else {
      if (!email || !password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage('Login successful! Redirecting...');
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          login(data.user);

          setTimeout(() => {
            setIsLoading(false);
            navigate(from);
          }, 1000);
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('Network error. Please check your connection and try again.');
        setIsLoading(false);
      }
    }
  };



  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-white to-pink-50 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {currentStep === 'otp' ? (
          <OTPVerification
            phone={phone}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            onBack={() => setCurrentStep('form')}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
          />
        ) : (
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 relative">
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
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Login to access your account</p>
            
            {/* Login Method Toggle */}
            {/* <div className="mt-4 flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Phone
              </button>
            </div> */}
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
          
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border-l-4 border-green-500 p-4 mb-6"
            >
              <p className="text-green-700 text-sm">{successMessage}</p>
            </motion.div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            {loginMethod === 'email' ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
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
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.241 12.0004 19.241C8.8704 19.241 6.21537 17.131 5.2654 14.291L1.27539 17.386C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
                </svg>
              </button>
              
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default LoginPage;