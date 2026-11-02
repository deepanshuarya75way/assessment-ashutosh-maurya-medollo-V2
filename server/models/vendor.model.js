const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactNumber: { type: String },
  medicinesSupplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
