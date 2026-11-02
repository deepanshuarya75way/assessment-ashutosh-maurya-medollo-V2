import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  
  CameraIcon
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import { useMedicine } from "../context/MedicineContext";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const { setSelectedMedicine } = useMedicine();
  // Get cart and login state from context
  const { cartItemsCount, isLoggedIn } = useCart();

  // Check login status on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [isLoggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserDropdownOpen(false);
    // The CartContext will handle the isLoggedIn state
    window.location.reload();
  };

  const navItems = [
    { name: "Be a Vendor", path: "/vendors" },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  const handleSearch = async (value) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/medicine-details/search/suggestions?q=${encodeURIComponent(value.trim())}`
      );
      const data = await res.json();
      if (data.success && data.suggestions) {
        // Format the suggestions to match expected format
        const formattedResults = data.suggestions.map(item => ({
          _id: item.id, // Use id from backend as _id for navigation
          id: item.id, // Also include id field
          name: item.name,
          brand: item.brand,
          manufacturer: item.manufacturer,
          price: item.price,
          image: item.image,
          composition: item.composition,
          molecules: item.molecules
        }));
        setResults(formattedResults);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    }
  };

  const handleSearchIconClick = (e, isMobile = false) => {
    e.preventDefault();
    const currentQuery = query.trim();
    const inputRef = isMobile ? mobileSearchInputRef : searchInputRef;

    if (currentQuery.length > 0) {
      // If there's text, navigate to products page with search query
      setResults([]);
      navigate(`/products?search=${encodeURIComponent(currentQuery)}`);
    } else {
      // If no text, focus the input field
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="glass-card shadow-md sticky top-0 z-50 border-b border-white/20"
    >
      <div className="py-4 px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1
              className="text-4xl font-extrabold tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, #7E22CE, #A21CAF, #C026D3, #E879F9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Medollo
            </h1>
          </Link>

          {/* Delivery in 10 minutes + location */}
          <div className="hidden sm:flex flex-col leading-tight ml-3 cursor-pointer select-none">
            <span className="text-base font-extrabold text-gray-800">
              Delivery in 10 minutes{" "}
            </span>
            <span className="text-primary font-semibold hover:underline">
              B-62, Sector-A, south city,Pune
            </span>
          </div>

          {/* Search Bar - visible on medium screens and up */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form 
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim().length > 0) {
                  handleSearchIconClick(e);
                }
              }}
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for medicines, products..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full py-2 px-4 pr-20 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim().length > 0) {
                    e.preventDefault();
                    handleSearchIconClick(e);
                  }
                }}
              />
              <div className="absolute right-0 top-0 mt-2 mr-3 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => handleSearchIconClick(e, false)}
                  className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
                <Link
                  to="/prescriptions"
                  className="text-gray-400 hover:text-primary transition-colors"
                  title="Upload Prescription"
                >
                  <CameraIcon className="h-5 w-5" />
                </Link>
              </div>
              {/* 🔽 SEARCH RESULTS DROPDOWN */}
              {results.length > 0 && (
                <div className="absolute left-0 w-full mt-2 glass-card border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      // use _id or id from backend
                      onClick={() => {
                        console.log("Navigating to:", item); // Debug
                        if (!item._id) {
                          console.error("Missing _id for item:", item);
                          return;
                        }
                        setQuery(item.name);
                        setSelectedMedicine(item);
                        setResults([]);
                        navigate(`/medicine/${item._id}`);
                      }}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.brand || "Medicine"}
                      </div>
                      {item.price && (
                        <div className="text-xs text-gray-400 mt-1">
                          ₹{item.price}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Navigation - visible on large screens */}

          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={item.path}
                    className={`text-sm font-bold px-1 py-1 rounded-md transition-colors 
            ${
              isActive
                ? "text-primary"
                : "text-gray-700 hover:text-primary hover:bg-gray-50"
            }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Cart and User Icons */}
          <div className="hidden sm:flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              ref={cartRef}
              className="relative"
            >
              <Link
                to="/cart"
                className="p-2 rounded-full hover:bg-gray-100 block"
              >
                <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )}
              </Link>
            </motion.div>

            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleUserDropdown}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <UserIcon className="h-6 w-6 text-gray-700" />
              </motion.button>

              {/* User dropdown menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 glass-card rounded-md shadow-lg py-1 z-50 border border-white/20"
                  >
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            Hi, {user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/profile?tab=medicines"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Medicines
                        </Link>
                        <Link
                          to="/profile?tab=orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign in
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Create account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search - visible on small screens only */}
        <div className="mt-4 md:hidden">
          <form 
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim().length > 0) {
                handleSearchIconClick(e, true);
              }
            }}
          >
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search for medicines, products..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full py-2 px-4 pr-20 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim().length > 0) {
                  e.preventDefault();
                  handleSearchIconClick(e, true);
                }
              }}
            />
            <div className="absolute right-0 top-0 mt-2 mr-3 flex items-center space-x-2">
              <Link
                to="/prescriptions"
                className="text-gray-400 hover:text-primary transition-colors"
                title="Upload Prescription"
              >
                <CameraIcon className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={(e) => handleSearchIconClick(e, true)}
                className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
            {/*  SEARCH RESULTS DROPDOWN */}
            {results.length > 0 && (
              <div className="absolute left-0 w-full mt-2 glass-card border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {results.map((item, index) => (
                  <Link
                    key={index}
                    to={item._id ? `/medicine/${item._id}` : "#"}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      if (!item._id) {
                        console.error("Missing _id for item:", item);
                        return;
                      }
                      setSelectedMedicine(item);
                      setQuery(item.name);
                      setResults([]);
                    }}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.brand || "Medicine"}
                    </div>
                    {item.price && (
                      <div className="text-xs text-gray-400 mt-1">
                        ₹{item.price}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden glass-card border-t border-white/20 shadow-lg"
          >
            <div className="container-custom py-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="block px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex sm:hidden items-center space-x-4 mt-4 px-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>
                      Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                    </span>
                  </Link>

                  {isLoggedIn ? (
                    <div className="flex flex-col space-y-2 w-full">
                      <p className="text-sm font-bold text-gray-900">
                        Hi, {user?.name || "User"}
                      </p>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors"
                      >
                        <UserIcon className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/profile?tab=medicines"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors"
                      >
                        <span>My Medicines</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-left text-red-600 hover:text-red-800 text-sm font-bold transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2 w-full">
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors"
                      >
                        <span>Sign in</span>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors"
                      >
                        <span>Create account</span>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
