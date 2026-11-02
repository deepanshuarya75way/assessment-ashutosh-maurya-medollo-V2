
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  CogIcon, 
  KeyIcon, 
  HeartIcon, 
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import PageTransition from '../components/ui/PageTransition';
import { useCart } from '../context/CartContext';
import MyMedicines from '../components/MyMedicines';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useCart();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  // Profile update state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Account deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Get the tab from URL query parameter if it exists
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['profile', 'orders', 'settings', 'medicines'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      navigate('/login', { 
        state: { 
          from: '/profile',
          message: 'Please log in to view your profile' 
        } 
      });
      return;
    }

    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        
        // Initialize profile data for editing
        setProfileData({
          name: parsedUser.name || '',
          phone: parsedUser.phone || '',
          address: parsedUser.address || ''
        });
        
        // Fetch real order history
        fetchOrderHistory();
      } catch (error) {
        console.error('Failed to parse user data', error);
      }
    }
    
    setIsLoading(false);
  }, [isLoggedIn, navigate]);

  // Fetch real order history from API
  const fetchOrderHistory = async () => {
    try {
      setIsLoadingOrders(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const orders = await response.json();
        setOrderHistory(orders);
      } else {
        console.error('Failed to fetch order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (profileError) setProfileError('');
    if (profileSuccess) setProfileSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setIsUpdatingProfile(true);

    // Validation
    if (!profileData.name.trim()) {
      setProfileError('Name is required');
      setIsUpdatingProfile(false);
      return;
    }

    if (!profileData.phone.trim()) {
      setProfileError('Phone number is required');
      setIsUpdatingProfile(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setProfileSuccess('Profile updated successfully!');
        
        // Update user data in state and localStorage
        const updatedUser = { ...userData, ...data.user };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setProfileSuccess('');
        }, 5000);
      } else {
        setProfileError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setProfileError('Network error. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsChangingPassword(true);

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from current password');
      setIsChangingPassword(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Clear success message after 5 seconds
        setTimeout(() => {
          setPasswordSuccess('');
        }, 5000);
      } else {
        setPasswordError(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError('Network error. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('Please enter your password to confirm account deletion');
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      });

      const data = await response.json();

      if (response.ok) {
        // Account deleted successfully
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        logout();
        navigate('/', { 
          state: { 
            message: 'Your account has been successfully deleted' 
          } 
        });
      } else {
        setDeleteError(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      setDeleteError('Network error. Please try again.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(true);
    setDeletePassword('');
    setDeleteError('');
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteError('');
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="max-w-7xl mx-auto mb-6">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-primary transition-colors flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Back to Home</span>
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary to-pink-600 py-8 px-6 text-white">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white mb-4 sm:mb-0 sm:mr-6">
                  <img 
                    src={userData?.avatarUrl || `https://ui-avatars.com/api/?name=User&background=random`} 
                    alt={userData?.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{userData?.name || 'User'}</h1>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2">
                    {userData?.email && (
                      <div className="flex items-center mt-1 sm:mt-0">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{userData.email}</span>
                      </div>
                    )}
                    {userData?.phone && (
                      <div className="flex items-center mt-1 sm:mt-0">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{userData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Tabs Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 flex items-center font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-6 flex items-center font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ShoppingBagIcon className="h-5 w-5 mr-2" />
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className={`py-4 px-6 flex items-center font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'medicines'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BeakerIcon className="h-5 w-5 mr-2" />
                  My Medicines
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-6 flex items-center font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <CogIcon className="h-5 w-5 mr-2" />
                  Account Settings
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <p className="text-gray-900">{userData?.name || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <p className="text-gray-900">{userData?.email || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <p className="text-gray-900">{userData?.phone || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <p className="text-gray-900">{userData?.address || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button 
                        onClick={() => setActiveTab('settings')} 
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-4 mt-8">Health Information</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-500 italic">No health information has been added yet.</p>
                    <button className="mt-4 text-primary hover:text-primary-dark font-medium">
                      + Add Health Information
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Order History</h2>
                  
                  {isLoadingOrders ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : orderHistory.length > 0 ? (
                    <div className="space-y-6">
                      {orderHistory.map(order => (
                        <div key={order._id} className="bg-gray-50 rounded-lg overflow-hidden">
                          <div className="bg-gray-100 px-4 py-3 flex flex-wrap justify-between items-center">
                            <div>
                              <span className="font-medium">{order.orderId}</span>
                              <span className="text-gray-500 text-sm ml-4">
                                Ordered on {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.orderStatus === 'delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.orderStatus === 'placed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.orderStatus === 'shipped'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                <div>
                                  <p className="font-medium">
                                    {item.medicine ? item.medicine.productName : 'Unknown Medicine'}
                                  </p>
                                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-medium">₹{item.price.toFixed(2)}</p>
                              </div>
                            ))}
                            
                            <div className="mt-4 text-right">
                              <p className="font-bold">Total: ₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-100 px-4 py-3 flex justify-end">
                            <button className="text-primary hover:text-primary-dark font-medium text-sm">
                              View Order Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <ShoppingBagIcon className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-gray-500">You haven't placed any orders yet</p>
                      <button 
                        onClick={() => navigate('/products')}
                        className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                      >
                        Browse Products
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* My Medicines Tab */}
              {activeTab === 'medicines' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <MyMedicines />
                </motion.div>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-primary" />
                        Update Profile
                      </h3>
                      
                      {/* Success Message */}
                      {profileSuccess && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-50 border-l-4 border-green-500 p-4 mb-4"
                        >
                          <p className="text-green-700 text-sm">{profileSuccess}</p>
                        </motion.div>
                      )}
                      
                      {/* Error Message */}
                      {profileError && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-50 border-l-4 border-red-500 p-4 mb-4"
                        >
                          <p className="text-red-700 text-sm">{profileError}</p>
                        </motion.div>
                      )}
                      
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input 
                              type="text"
                              name="name"
                              value={profileData.name}
                              onChange={handleProfileChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input 
                              type="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                              value={userData?.email || ''}
                              disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input 
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input 
                              type="text"
                              name="address"
                              value={profileData.address}
                              onChange={handleProfileChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="Enter your address"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button 
                            type="submit"
                            disabled={isUpdatingProfile}
                            className={`bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                              isUpdatingProfile ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                          >
                            {isUpdatingProfile ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                              </div>
                            ) : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <KeyIcon className="h-5 w-5 mr-2 text-primary" />
                        Change Password
                      </h3>
                      
                      {/* Success Message */}
                      {passwordSuccess && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-50 border-l-4 border-green-500 p-4 mb-4"
                        >
                          <p className="text-green-700 text-sm">{passwordSuccess}</p>
                        </motion.div>
                      )}
                      
                      {/* Error Message */}
                      {passwordError && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-50 border-l-4 border-red-500 p-4 mb-4"
                        >
                          <p className="text-red-700 text-sm">{passwordError}</p>
                        </motion.div>
                      )}
                      
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input 
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="••••••••"
                              required
                            />
                          </div>
                          
                          <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2"></div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input 
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="••••••••"
                              required
                              minLength={6}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input 
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="••••••••"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button 
                            type="submit"
                            disabled={isChangingPassword}
                            className={`bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                              isChangingPassword ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                          >
                            {isChangingPassword ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                              </div>
                            ) : 'Update Password'}
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-red-800 mb-4">Account Actions</h3>
                      <p className="text-sm text-red-600 mb-4">These actions have serious consequences. Please be certain.</p>
                      
                      <div className="space-y-4">
                        <button 
                          onClick={handleLogout}
                          className="w-full bg-white border border-red-300 text-red-700 py-2 px-4 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex justify-center items-center"
                        >
                          Log Out
                        </button>
                        
                        <button 
                          onClick={confirmDeleteAccount}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex justify-center items-center"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Account</h3>
              <p className="text-sm text-gray-500 mb-4">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </p>
              
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm:
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
              
              {deleteError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-3 mt-4"
                >
                  <p className="text-red-700 text-sm">{deleteError}</p>
                </motion.div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteAccount}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                disabled={isDeletingAccount}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || !deletePassword.trim()}
                className={`flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                  isDeletingAccount || !deletePassword.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDeletingAccount ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </div>
                ) : 'Delete Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
};

export default ProfilePage;