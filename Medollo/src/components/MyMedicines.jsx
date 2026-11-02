import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

const MyMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const { isLoggedIn } = useCart();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand_name: '',
    dosage: '',
    quantity: 1,
    price: 0,
    image: '',
    description: '',
    notes: '',
    reminder: {
      enabled: false,
      time: '',
      frequency: 'daily'
    }
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchMedicines();
      fetchStats();
    }
  }, [isLoggedIn]);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user-medicines`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMedicines(data.data || []);
      } else if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user-medicines/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to add medicines');
        return;
      }
      
      const url = editingMedicine 
        ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user-medicines/${editingMedicine._id}`
        : `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user-medicines`;
      
      const method = editingMedicine ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          medicine: {
            name: formData.name,
            brand_name: formData.brand_name,
            dosage: formData.dosage,
            quantity: formData.quantity,
            price: formData.price,
            image: formData.image,
            description: formData.description
          },
          notes: formData.notes,
          reminder: formData.reminder
        })
      });

      if (response.ok) {
        await fetchMedicines();
        await fetchStats();
        resetForm();
        setShowAddForm(false);
        setEditingMedicine(null);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save medicine');
      }
    } catch (error) {
      console.error('Error saving medicine:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this medicine?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to manage medicines');
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user-medicines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchMedicines();
        await fetchStats();
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete medicine');
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.medicine.name,
      brand_name: medicine.medicine.brand_name,
      dosage: medicine.medicine.dosage,
      quantity: medicine.medicine.quantity,
      price: medicine.medicine.price,
      image: medicine.medicine.image,
      description: medicine.medicine.description,
      notes: medicine.notes,
      reminder: medicine.reminder
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand_name: '',
      dosage: '',
      quantity: 1,
      price: 0,
      image: '',
      description: '',
      notes: '',
      reminder: {
        enabled: false,
        time: '',
        frequency: 'daily'
      }
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <HeartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Log In</h3>
        <p className="text-gray-600">You need to be logged in to manage your medicines.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your medicines...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Medicines</h2>
          <p className="text-gray-600">Manage your personal medicine collection</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Medicine</span>
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4"
        >
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError('')}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HeartIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Medicines</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMedicines || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeMedicines || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedMedicines || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingMedicine(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.brand_name}
                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Reminder Settings */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Reminder Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.reminder.enabled}
                      onChange={(e) => setFormData({
                        ...formData,
                        reminder: { ...formData.reminder, enabled: e.target.checked }
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable reminders</span>
                  </label>

                  {formData.reminder.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reminder Time
                        </label>
                        <input
                          type="time"
                          value={formData.reminder.time}
                          onChange={(e) => setFormData({
                            ...formData,
                            reminder: { ...formData.reminder, time: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency
                        </label>
                        <select
                          value={formData.reminder.frequency}
                          onChange={(e) => setFormData({
                            ...formData,
                            reminder: { ...formData.reminder, frequency: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMedicine(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medicines List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Medicines</h3>
        </div>

        {medicines.length === 0 ? (
          <div className="p-8 text-center">
            <HeartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No medicines yet</h3>
            <p className="text-gray-600 mb-4">Start building your medicine collection by adding your first medicine.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Your First Medicine
            </motion.button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {medicines.map((medicine, index) => (
                <motion.div
                  key={medicine._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {medicine.medicine.image && (
                      <img
                        src={medicine.medicine.image}
                        alt={medicine.medicine.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {medicine.medicine.name}
                          </h4>
                          {medicine.medicine.brand_name && (
                            <p className="text-sm text-gray-600">
                              {medicine.medicine.brand_name}
                            </p>
                          )}
                          {medicine.medicine.dosage && (
                            <p className="text-sm text-gray-500">
                              Dosage: {medicine.medicine.dosage}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">
                            ₹{medicine.medicine.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            x{medicine.medicine.quantity}
                          </span>
                        </div>
                      </div>
                      
                      {medicine.notes && (
                        <p className="mt-2 text-sm text-gray-600">
                          <strong>Notes:</strong> {medicine.notes}
                        </p>
                      )}
                      
                      {medicine.reminder.enabled && (
                        <div className="mt-2 flex items-center text-sm text-blue-600">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>
                            Reminder: {medicine.reminder.time} ({medicine.reminder.frequency})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(medicine)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(medicine._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMedicines;
