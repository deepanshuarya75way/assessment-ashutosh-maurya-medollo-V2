
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useMedicine } from "../context/MedicineContext";
import { useCart } from "../context/CartContext";
import FlaskConicalIcon from "../components/FlaskConicalIcon";

const MedicineDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedMedicine } = useMedicine();
  const { addToCart, isLoggedIn } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        // Always fetch full details from API when we have an ID
        // selectedMedicine is only used as initial/fallback data
        if (id) {
          setLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/medicine-details/${id}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              console.log("Medicine details fetched:", data.data); // Debug log
              setMedicine(data.data);
            } else {
              console.error("Medicine not found or invalid response:", data);
              // Fallback to selectedMedicine if API fails
              if (selectedMedicine) {
                console.log("Using selectedMedicine as fallback:", selectedMedicine);
                setMedicine(selectedMedicine);
              }
            }
          } else {
            console.error("Failed to fetch medicine:", response.status);
            // Fallback to selectedMedicine if API fails
            if (selectedMedicine) {
              console.log("Using selectedMedicine as fallback:", selectedMedicine);
              setMedicine(selectedMedicine);
            }
          }
        } else if (selectedMedicine) {
          // Only use selectedMedicine if we don't have an ID
          setMedicine(selectedMedicine);
        }
      } catch (error) {
        console.error("Error fetching medicine details:", error);
        // Fallback to selectedMedicine if fetch fails
        if (selectedMedicine && !medicine) {
          setMedicine(selectedMedicine);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only re-fetch when id changes

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded-lg max-w-4xl mx-auto mt-10 text-center">
        <h3 className="font-bold mb-2 text-lg">Medicine Not Found</h3>
        <p className="text-sm text-gray-600 mb-4">
          The medicine you're looking for could not be found.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Products
        </button>
      </div>
    );
  }

  const details = medicine;
  
  const suggestions = [];

  // ---------- Helpers ----------
  const parseNumber = (v) => {
    if (v == null) return NaN;
    if (typeof v === "number") return v;
    const cleaned = String(v).replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
    return isNaN(n) ? NaN : n;
  };

  const formatINR = (n) =>
    isNaN(n) ? "N/A" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  // Use the backend data structure - mrp is already calculated by backend (10% higher than price)
  const sellingPrice = parseNumber(details.price); // Selling price from backend
  const mrp = parseNumber(details.mrp); // MRP already calculated by backend (10% higher)
  const effectivePrice = sellingPrice;

  const totalMrp = isNaN(mrp) ? null : mrp * quantity;
  const totalEffective = isNaN(effectivePrice) ? null : effectivePrice * quantity;
  const perUnitDisplay = !isNaN(effectivePrice) ? formatINR(effectivePrice) : "N/A";

  const savingsPerUnit = !isNaN(mrp) && !isNaN(effectivePrice) && mrp > effectivePrice ? (mrp - effectivePrice) : 0;
  const savingsTotal = savingsPerUnit * quantity;
  const savingsPercent = details.discount || 10; // Use discount from backend (defaults to 10%)

  // ---------- Handlers ----------
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: `/medicine/${details.id}`,
          message: "Please log in to add medicines to your cart.",
        },
      });
      return;
    }

    // Normalize product object for cart using backend data structure
    const normalized = {
      id: details.id,
      name: details.name || details.productName,
      image: details.image || details.imageUrl,
      price: effectivePrice,
      mrp: mrp,
      discount: details.discount || 10,
      brand: details.brand,
      manufacturer: details.manufacturer,
      composition: details.composition || details.compositionName,
      molecules: details.molecules,
      packSize: details.packSize,
      productForm: details.productForm || details.productFormName,
      prescriptionRequired: details.prescriptionRequired,
      description: details.description || details.productLongDescription
    };

    addToCart(normalized, quantity);
  };

  const handleOrderNow = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: "/cart",
          message: "Please log in to order medicines.",
        },
      });
      return;
    }

    const normalized = {
      id: details.id,
      name: details.name || details.productName,
      image: details.image || details.imageUrl,
      price: effectivePrice,
      mrp: mrp,
      discount: details.discount || 10,
      brand: details.brand,
      manufacturer: details.manufacturer,
      composition: details.composition || details.compositionName,
      molecules: details.molecules,
      packSize: details.packSize,
      productForm: details.productForm || details.productFormName,
      prescriptionRequired: details.prescriptionRequired,
      description: details.description || details.productLongDescription
    };

    addToCart(normalized, quantity);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen modern-bg py-8">
      <div className="max-w-5xl mx-auto p-8 glass-card rounded-xl shadow-2xl">
      {/* Back button */}
      <button
        onClick={() => navigate("/products")}
        className="mb-6 flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Search
      </button>

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center space-x-4">
          <FlaskConicalIcon className="h-10 w-10 text-primary flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{details.name}</h1>
            {(details.rating || details.reviews) && (
              <div className="flex items-center space-x-2 mt-1">
                {details.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="ml-1 text-sm font-medium text-gray-700">{details.rating}</span>
                  </div>
                )}
                {details.reviews && (
                  <>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-gray-600">{details.reviews} reviews</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Image + controls */}
        <div className="flex flex-col items-center md:col-span-1">
          {(details.image || details.imageUrl) ? (
            <img
              src={details.image || details.imageUrl}
              alt={details.name || "Medicine"}
              className="w-40 h-auto object-cover rounded-lg shadow-md mb-4"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/160x160/FEE2E2/DC2626?text=No+Image";
              }}
            />
          ) : (
            <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">No Image</div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center space-x-3 mt-2 w-full">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 border rounded"
            >
              -
            </button>
            <div className="px-4 py-2 border rounded min-w-[40px] text-center">{quantity}</div>
            <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 border rounded">
              +
            </button>
          </div>

          {/* Add / Order */}
          <div className="flex flex-col w-full gap-3 mt-4">
            <button onClick={handleAddToCart} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-all font-semibold">
              Add to Cart
            </button>
            <button onClick={handleOrderNow} className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all font-semibold">
              Order Now
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {(details.brand || details.manufacturer || details.packSize || details.productForm || details.countryOfOrigin || details.packaging) && (
                <>
                  {details.brand && (
                    <p className="mb-1"><strong>Brand:</strong> {details.brand}</p>
                  )}
                  {details.manufacturer && (
                    <p className="mb-1"><strong>Manufacturer:</strong> {details.manufacturer}</p>
                  )}
                  {details.packSize && (
                    <p className="mb-1"><strong>Pack Size:</strong> {`${details.packSize}${details.saleUnit ? ` ${details.saleUnit}` : ''}`}</p>
                  )}
                  {details.productForm && (
                    <p className="mb-1"><strong>Product Form:</strong> {details.productForm}</p>
                  )}
                  {details.countryOfOrigin && (
                    <p className="mb-1"><strong>Country of Origin:</strong> {details.countryOfOrigin}</p>
                  )}
                  {details.packaging && (
                    <p className="mb-1"><strong>Packaging:</strong> {details.packaging}</p>
                  )}
                </>
              )}
            </div>
            <div>
              {(details.composition || details.molecules || details.productId || details.prescriptionRequired) && (
                <>
                  {details.composition && (
                    <p className="mb-1"><strong>Composition:</strong> <span className="italic">{details.composition}</span></p>
                  )}
                  {details.molecules && (
                    <p className="mb-1"><strong>Molecules:</strong> <span className="italic">{details.molecules}</span></p>
                  )}
                  {details.prescriptionRequired && (
                    <p className="mb-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        ⚠️ Prescription Required
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          
          {details.description && details.description.trim() && (
            <div className="mt-4 pt-4 border-t">
              <p><strong>Description:</strong></p>
              <p className="text-gray-700 mt-2">{details.description}</p>
            </div>
          )}

          <div className="mt-4 p-4 bg-green-50 rounded-lg shadow-inner">
            <p className="font-semibold text-lg text-green-700 mb-2">Price Details (per unit)</p>

            <p><strong>MRP:</strong> <span className="text-red-600 line-through">{!isNaN(mrp) ? formatINR(mrp) : "N/A"}</span></p>

            <p><strong>Selling Price:</strong> <span className="text-primary font-bold text-xl">{!isNaN(sellingPrice) ? formatINR(sellingPrice) : "N/A"}</span></p>
            
            <div className="mt-2 p-2 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-secondary font-semibold text-sm">🎉 Special Offer: {savingsPercent}% OFF on MRP!</p>
            </div>

            <div className="mt-3">
              <p><strong>Selected unit price:</strong> {perUnitDisplay}</p>
              <p><strong>Total for {quantity}:</strong> { !isNaN(totalEffective) ? formatINR(totalEffective) : "N/A" }</p>

              {savingsPerUnit > 0 && (
                <div className="mt-2 p-3 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-sm text-success font-semibold">
                    💰 You save {formatINR(savingsPerUnit)} per unit ({savingsPercent}% OFF)
                  </p>
                  <p className="text-sm text-success/80">
                    Total savings for {quantity} units: {formatINR(savingsTotal)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Medicines */}
      {suggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Suggested Medicines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {suggestions.map((item, index) => (
              <a
                key={index}
                href={item.product_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center text-center"
              >
                <img
                  src={item.image_url || "https://placehold.co/120x120/F3F4F6/6B7280?text=No+Image"}
                  alt={item.name || "Medicine"}
                  className="w-24 h-24 object-cover rounded-md mb-3"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/120x120/FEE2E2/DC2626?text=No+Image";
                  }}
                />
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.name || "Unknown Medicine"}</h3>
                {item.mrp && <p className="text-sm text-gray-600">MRP: <span className="font-medium">₹{item.mrp}</span></p>}
              </a>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MedicineDetailsPage;
