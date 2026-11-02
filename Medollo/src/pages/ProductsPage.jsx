import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ShoppingCartIcon,
  CheckIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import PageTransition from "../components/ui/PageTransition";
import LoginRequiredModal from "../components/ui/LoginRequiredModal";
import { useCart } from "../context/CartContext";
import { useMedicine } from "../context/MedicineContext";

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredProductsCount, setFilteredProductsCount] = useState(0);
  const productsPerPage = 12;
  const location = useLocation();
  const { toggleCart, addToCart, isLoggedIn } = useCart();
  const { setSelectedMedicine } = useMedicine();

  const [addedToCart, setAddedToCart] = useState({});
  const [isCartDebouncing, setIsCartDebouncing] = useState(false);
  const navigate = useNavigate();
  const [medicineData, setMedicineData] = useState([]);
  const [categories, setCategories] = useState([
    { id: "all", name: "All Products" },
  ]);
  const [allProducts, setAllProducts] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [mobileSortDropdownOpen, setMobileSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  const mobileSortDropdownRef = useRef(null);

  // Read search query from URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  // Fetch medicine data and categories
  useEffect(() => {
    setLoading(true);

    // Fetch categories
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/medicine-details/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));

    // Fetch products
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: productsPerPage.toString(),
        category: activeCategory,
        search: searchTerm,
        sortBy: sortBy,
        priceMin: priceRange[0].toString(),
        priceMax: priceRange[1].toString()
      });

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/medicine-details/paginated?${params}`
      );

      if (!response.ok) throw new Error("Failed to fetch medicines");

      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setFilteredProductsCount(data.pagination.totalItems);
      }
    } catch (err) {
      console.error("Error fetching medicines:", err);
    } finally {
      setLoading(false);
    }
  };
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
      if (mobileSortDropdownRef.current && !mobileSortDropdownRef.current.contains(event.target)) {
        setMobileSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search term changes for suggestions
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      fetchSearchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const fetchSearchSuggestions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/medicine-details/search/suggestions?q=${encodeURIComponent(searchTerm)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.suggestions);
          setShowSuggestions(data.suggestions.length > 0);
        }
      }
    } catch (err) {
      console.error("Error fetching search suggestions:", err);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, priceRange, sortBy, searchTerm, currentPage]);

  // Handle window resize to sync filter states
  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyDesktop = window.innerWidth >= 1024;
      setIsDesktop(isCurrentlyDesktop);
      
      // When switching from desktop to mobile, close mobile filters
      if (!isCurrentlyDesktop && filtersOpen) {
        setFiltersOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Set initial state
    setIsDesktop(window.innerWidth >= 1024);
    return () => window.removeEventListener('resize', handleResize);
  }, [filtersOpen]);

  // Toggle filters visibility (for mobile and desktop)
  const toggleFilters = () => {
    if (isDesktop) {
      // Desktop: toggle sidebar
      setDesktopFiltersOpen(!desktopFiltersOpen);
    } else {
      // Mobile: toggle slide-in panel
      setFiltersOpen(!filtersOpen);
    }
  };

  // Determine if filters are currently open
  const filtersAreOpen = isDesktop ? desktopFiltersOpen : filtersOpen;

  // Sort options
  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    setSortDropdownOpen(false);
    setMobileSortDropdownOpen(false);
  };

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Popularity";

  return (
    <PageTransition>
      <div className="modern-bg min-h-screen pb-12">
        {/* Hero Section */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Our Products
            </h1>
            <p className="text-primary-100 md:text-lg">
              Browse our extensive collection of high-quality medicines and
              health products
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-6">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-8 flex flex-wrap items-center gap-4">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 mr-2" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search medicines, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}

                {/* Search Suggestions */}
                {showSuggestions && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-72 overflow-y-auto">
                    <ul>
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => {
                            setSearchTerm(suggestion.name);
                            setShowSuggestions(false);
                          }}
                        >
                          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium">
                              {suggestion.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {suggestion.brand} - ₹{suggestion.price}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="hidden sm:flex items-center">
                <label className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center justify-between bg-white border-2 border-gray-300 rounded-lg py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-400 transition-colors shadow-sm hover:shadow-md min-w-[180px]"
                  >
                    <span>{currentSortLabel}</span>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg 
                        className={`h-5 w-5 text-gray-400 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-primary hover:text-white ${
                              sortBy === option.value
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.label}</span>
                              {sortBy === option.value && (
                                <CheckIcon className="h-5 w-5" />
                              )}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={toggleFilters}
                className={`flex items-center px-3 py-2 border rounded-md transition-colors ${
                  filtersAreOpen
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
                <span className="text-sm">
                  Filters{filtersAreOpen && <span className="ml-1 text-xs opacity-80"></span>}
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters - Desktop */}
            <AnimatePresence>
              {desktopFiltersOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:block w-64 flex-shrink-0"
                >
                  <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-lg mb-4">Filters</h3>
                <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
                  {categories.map((category) => {
                    if (category.type === "divider") {
                      return (
                        <div key={category.id} className="pt-2 pb-1">
                          <h4 className="font-medium text-sm text-gray-500 border-b border-gray-200 pb-1">
                            {category.name}
                          </h4>
                        </div>
                      );
                    }

                    if (
                      category.type === "special" ||
                      category.type === "productForm" ||
                      category.type === "category"
                    ) {
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            setActiveCategory(category.id);
                            setCurrentPage(1);
                          }}
                          className={`block w-full text-left py-1.5 px-3 rounded-md transition text-sm ${activeCategory === category.id
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100 text-gray-700"
                            } ${category.type === "special" ? "font-medium" : ""
                            }`}
                        >
                          {category.name}
                        </button>
                      );
                    }

                    return null;
                  })}
                </div>

                <div className="my-6 border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-lg mb-4">Price Range</h3>
                  <div className="px-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full h-2 bg-gray-200 rounded-md appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-gray-200 rounded-md appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Filters - Slide in from left */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={toggleFilters}
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl p-6 overflow-y-auto"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "tween" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="font-medium text-lg mb-4">Filters</h3>
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      {categories.map((category) => {
                        if (category.type === "divider") {
                          return (
                            <div key={category.id} className="pt-2 pb-1">
                              <h4 className="font-medium text-sm text-gray-500 border-b border-gray-200 pb-1">
                                {category.name}
                              </h4>
                            </div>
                          );
                        }

                        if (
                          category.type === "special" ||
                          category.type === "productForm" ||
                          category.type === "category"
                        ) {
                          return (
                            <button
                              key={category.id}
                              onClick={() => {
                                setActiveCategory(category.id);
                                setCurrentPage(1); // Reset to first page
                                toggleFilters();
                              }}
                              className={`block w-full text-left py-1.5 px-3 rounded-md transition text-sm ${activeCategory === category.id
                                ? "bg-primary text-white"
                                : "hover:bg-gray-100 text-gray-700"
                                } ${category.type === "special" ? "font-medium" : ""
                                }`}
                            >
                              {category.name}
                            </button>
                          );
                        }

                        return null;
                      })}
                    </div>

                    <div className="my-6 border-t border-gray-200 pt-6">
                      <h3 className="font-medium text-lg mb-4">Price Range</h3>
                      <div className="px-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>₹{priceRange[0]}</span>
                          <span>₹{priceRange[1]}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20000"
                          step="100"
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([
                              parseInt(e.target.value),
                              priceRange[1],
                            ])
                          }
                          className="w-full h-2 bg-gray-200 rounded-md appearance-none cursor-pointer accent-primary"
                        />
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              parseInt(e.target.value),
                            ])
                          }
                          className="w-full h-2 bg-gray-200 rounded-md appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => {
                          // Apply filters
                          toggleFilters();
                        }}
                        className="w-full bg-primary text-white py-2 rounded-md"
                      >
                        Apply Filters
                      </button>
                      <button
                        onClick={toggleFilters}
                        className="w-full mt-2 bg-gray-100 text-gray-700 py-2 rounded-md"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Sort - Select */}
              <div className="lg:hidden mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <div className="relative" ref={mobileSortDropdownRef}>
                  <button
                    onClick={() => setMobileSortDropdownOpen(!mobileSortDropdownOpen)}
                    className="flex items-center justify-between w-full bg-white border-2 border-gray-300 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-400 transition-colors shadow-sm hover:shadow-md"
                  >
                    <span>{currentSortLabel}</span>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg 
                        className={`h-5 w-5 text-gray-400 transition-transform ${mobileSortDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence>
                    {mobileSortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-primary hover:text-white ${
                              sortBy === option.value
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.label}</span>
                              {sortBy === option.value && (
                                <CheckIcon className="h-5 w-5" />
                              )}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Results summary */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {products.length} of {filteredProductsCount} products
                  {activeCategory !== "all" &&
                    activeCategory !== "popular" &&
                    !activeCategory.startsWith("divider-")
                    ? ` in ${categories.find((c) => c.id === activeCategory)?.name || "Selected Filter"
                    }`
                    : activeCategory === "popular"
                      ? " in Popular Categories"
                      : ""}
                  (Page {currentPage} of {totalPages})
                </p>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card rounded-lg shadow-md overflow-hidden"
                      >
                        <div className="relative bg-white">
                          <Link 
                            to={`/medicine/${product.id}`}
                            onClick={() => {
                              setSelectedMedicine(product);
                            }}
                            className="block cursor-pointer"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="object-contain w-full h-40 object-center p-3"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/300x300/FF385C/FFFFFF/png?text=Medicine";
                              }}
                            />
                          </Link>
                          {product.discount && product.discount > 0 && (
                            <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-md">
                              {product.discount}% OFF
                            </div>
                          )}
                          {product.perUnit && (
                            <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                              {product.perUnit}
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <Link 
                            to={`/medicine/${product.id}`}
                            onClick={() => {
                              setSelectedMedicine(product);
                            }}
                            className="block cursor-pointer"
                          >
                            <h3 className="font-semibold text-sm mb-1 hover:text-primary transition line-clamp-2 text-gray-900">
                              {product.name}
                            </h3>
                          </Link>

                          {product.brand && (
                            <p className="text-xs text-gray-500 mb-1 mt-1">
                              {product.brand}
                            </p>
                          )}
                          {product.composition && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                              {product.composition}
                            </p>
                          )}

                          {(product.rating || product.reviews) && (
                            <div className="flex items-center mb-2">
                              {product.rating && (
                                <>
                                  <div className="flex items-center">
                                    <span className="text-yellow-400 text-sm">★</span>
                                    <span className="ml-1 text-xs font-medium">
                                      {product.rating}
                                    </span>
                                  </div>
                                  {product.reviews && (
                                    <>
                                      <span className="mx-2 text-gray-300">|</span>
                                      <span className="text-xs text-gray-600">
                                        {product.reviews}
                                      </span>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <div>
                              {product.discount > 0 ? (
                                <div className="flex flex-col">
                                  <span className="text-base font-bold text-gray-900">
                                    ₹{product.price?.toFixed(2) || product.price}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500 line-through">
                                      ₹{product.mrp?.toFixed(2) || product.mrp}
                                    </span>
                                    <span className="text-xs text-success font-semibold">
                                      {product.discount}% off
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-base font-bold text-gray-900">
                                  ₹{product.price?.toFixed(2) || product.price}
                                </span>
                              )}
                            </div>

                            <div className="flex space-x-1">
                              <button
                                className={`p-2 ${addedToCart[product.id]
                                  ? "bg-green-500 text-white"
                                  : "text-primary hover:bg-primary hover:text-white"
                                  } 
                                rounded-full transition duration-300`}
                                aria-label="Add to cart"
                                onClick={(e) => {
                                  e.preventDefault();

                                  // Prevent multiple rapid cart opens
                                  if (isCartDebouncing) return;

                                  const success = addToCart(product);

                                  if (success) {
                                    // Only show animation and open cart if adding was successful
                                    setAddedToCart((prev) => ({
                                      ...prev,
                                      [product.id]: true,
                                    }));

                                    // Reset animation after 2 seconds
                                    setTimeout(() => {
                                      setAddedToCart((prev) => ({
                                        ...prev,
                                        [product.id]: false,
                                      }));
                                    }, 2000);

                                    // Set debounce flag to prevent multiple rapid cart toggles
                                    setIsCartDebouncing(true);

                                    // Open cart sidebar
                                    toggleCart(true); // Explicitly open the cart

                                    // Reset debounce flag after delay
                                    setTimeout(() => {
                                      setIsCartDebouncing(false);
                                    }, 1000);
                                  } else {
                                    // If not logged in, redirect to login page or show login modal
                                    setLoginModalOpen(true);
                                  }
                                }}
                              >
                                {addedToCart[product.id] ? (
                                  <CheckIcon className="h-5 w-5" />
                                ) : (
                                  <ShoppingCartIcon className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                className="p-2 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full transition"
                                aria-label="Add to wishlist"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!isLoggedIn) {
                                    setLoginModalOpen(true);
                                  } else {
                                    // Add to wishlist functionality would go here
                                    console.log(
                                      "Added to wishlist:",
                                      product.name
                                    );
                                  }
                                }}
                              >
                                <HeartIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )
                : (
                  // No products found
                  <div className="bg-white p-8 rounded-lg text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      No Medicines Found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm
                        ? `We couldn't find any medicines matching "${searchTerm}". Try using different keywords or browsing categories.`
                        : "Try adjusting your filter criteria or search for a specific medicine by name, brand, or composition."}
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        setPriceRange([0, 2000]);
                        setSortBy("popularity");
                        setSearchTerm("");
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Reset Filters
                    </button>
                  </div>
                )
              }

              {/* Pagination - only show when there are products and more than one page */}
              {products.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      Previous
                    </button>

                    {/* First page always shown */}
                    {totalPages > 0 && (
                      <button
                        onClick={() => setCurrentPage(1)}
                        className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-medium ${currentPage === 1
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        1
                      </button>
                    )}

                    {/* Show ellipsis if there are many pages before current */}
                    {currentPage > 4 && (
                      <span className="px-2 py-2 border-t border-b border-gray-300 text-gray-500">
                        ...
                      </span>
                    )}

                    {/* Pages around current page */}
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Only show pages close to current page (avoids too many buttons)
                      if (
                        pageNum !== 1 &&
                        pageNum !== totalPages && // Skip first and last pages (shown separately)
                        ((pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1) || // Show adjacent pages
                          (currentPage <= 3 && pageNum <= 4) || // Show first few pages when at the start
                          (currentPage >= totalPages - 2 &&
                            pageNum >= totalPages - 3)) // Show last few pages when at the end
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-medium ${currentPage === pageNum
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}

                    {/* Show ellipsis if there are many pages after current */}
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 py-2 border-t border-b border-gray-300 text-gray-500">
                        ...
                      </span>
                    )}

                    {/* Last page always shown if not the first page */}
                    {totalPages > 1 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-medium ${currentPage === totalPages
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        returnUrl={location.pathname}
      />
    </PageTransition>
  );
};

export default ProductsPage;
