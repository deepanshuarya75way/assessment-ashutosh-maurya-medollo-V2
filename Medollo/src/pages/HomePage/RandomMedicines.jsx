import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCartIcon,
  HeartIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useMedicine } from "../../context/MedicineContext";
import { useCart } from "../../context/CartContext";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const RandomMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const { setSelectedMedicine } = useMedicine();
  const { addToCart, isLoggedIn, toggleCart } = useCart();

  useEffect(() => {
    const fetchRandomMedicines = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch random medicines from the new API
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/medicine-details/paginated?page=1&limit=8&sortBy=name`
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setMedicines(data.data);
          // Initialize quantities
          const initialQuantities = {};
          data.data.forEach(med => {
            initialQuantities[med.id] = 0;
          });
          setQuantities(initialQuantities);
        }
      } catch (err) {
        console.error("Error fetching random medicines:", err);
        setError("Failed to load random medicines. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRandomMedicines();
  }, []);

  const handleQuantityChange = (medicineId, change) => {
    setQuantities(prev => ({
      ...prev,
      [medicineId]: Math.max(0, (prev[medicineId] || 0) + change)
    }));
  };

  const handleAddToCart = (medicine) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const quantity = quantities[medicine.id] || 1;
    if (quantity > 0) {
      addToCart(medicine, quantity);
      setQuantities(prev => ({ ...prev, [medicine.id]: 0 }));
      toggleCart(true); // Open cart sidebar
    }
  };

  if (loading)
    return (
      <div className="text-center p-10">
        <div className="animate-spin mx-auto h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Loading random medicines...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-4xl mx-auto mt-8">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowRightIcon className="h-4 w-4 mr-1" /> Try Again
        </button>
      </div>
    );

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {medicines.map((med) => (
              <motion.div
                key={med.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="glass-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all border border-white/20"
              >
            {/* Product Image */}
            <div 
              className="relative cursor-pointer"
              onClick={() => {
                setSelectedMedicine(med);
                navigate(`/medicine/${med.id}`);
              }}
            >
              <img
                src={med.image}
                alt={med.name}
                className="w-full h-32 object-contain bg-gray-50 p-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/160x160/FEE2E2/DC2626?text=No+Image";
                }}
              />
                  {med.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {med.discount}% OFF
                    </div>
                  )}
            </div>

            {/* Product Details */}
            <div className="p-3">
              <h3 className="font-semibold hover:cursor-pointer hover:text-primary text-sm mb-1 line-clamp-2 text-gray-900" onClick={() => {
                setSelectedMedicine(med);
                navigate(`/medicine/${med.id}`);
              }}>
                {med.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{med.brand}</p>
              
              {/* Price */}
              <div className="flex items-center mb-3">
                <span className="text-sm font-bold text-gray-900">
                  ₹{med.price}
                </span>
                {med.mrp && med.mrp > med.price && (
                  <span className="text-xs text-gray-500 line-through ml-2">
                    ₹{med.mrp}
                  </span>
                )}
              </div>

              {/* Quantity Controls - Modern Style */}
              {quantities[med.id] > 0 ? (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg p-2">
                  <button
                    onClick={() => handleQuantityChange(med.id, -1)}
                    className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 transition-colors"
                  >
                    <MinusIcon className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-semibold text-primary">
                    {quantities[med.id]}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(med.id, 1)}
                    className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 transition-colors"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(med)}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RandomMedicines;
