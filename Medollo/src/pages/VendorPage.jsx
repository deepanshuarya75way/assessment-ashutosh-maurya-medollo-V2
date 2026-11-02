import React, { useState } from "react";
import AnimatedBackground from '../components/ui/AnimatedBackground';

const VendorPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    address: "",
    contactEmail: "",
    contactNumber: "",
    medicinesSupplied: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          medicinesSupplied: formData.medicinesSupplied
            ? formData.medicinesSupplied.split(",").map((m) => m.trim())
            : [],
        }),
      });

      if (!res.ok) throw new Error("Failed to save vendor");
      setFormData({
        name: "",
        licenseNumber: "",
        address: "",
        contactEmail: "",
        contactNumber: "",
        medicinesSupplied: "",
      });

      alert("Vendor added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving vendor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <AnimatedBackground />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
        <div className="container-custom py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-darkblue mb-2">Vendor Network</h1>
          <p className="text-gray-600 max-w-2xl">Partner with Medollo to supply authentic medicines across India. Add new vendors using the form below.</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Vendor Form */}
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-md border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-darkblue">Add Vendor</h2>
            <p className="text-sm text-gray-500 mt-1">Provide vendor details to onboard quickly.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Vendor Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., HealthCare Pharma"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g., LIC-XXXX-2025"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Medicines Supplied</label>
                <input
                  type="text"
                  name="medicinesSupplied"
                  value={formData.medicinesSupplied}
                  onChange={handleChange}
                  placeholder="Comma separated: Paracetamol, Amoxicillin, ..."
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Tip: Use commas to add multiple medicines.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition flex items-center justify-center"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Add Vendor'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorPage;
