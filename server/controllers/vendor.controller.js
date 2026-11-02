const Vendor = require("../models/vendor.model.js");
const Medicine = require("../models/Medicine.js");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//  Get all vendors
const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("medicinesSupplied");
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Create vendor
const createVendor = async (req, res) => {
  try {
    const { name, licenseNumber, address, contactEmail, contactNumber, description } = req.body;

    // Validate required fields
    if (!name || !licenseNumber || !address || !contactEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vendor = new Vendor({
      name,
      licenseNumber,
      address,
      contactEmail,
      contactNumber: contactNumber || "",
      description: description || "",
      medicinesSupplied: []
    });

    const savedVendor = await vendor.save();
    res.status(201).json(savedVendor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating vendor", error: err.message });
  }
};

//  Get vendor by ID
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate("medicinesSupplied");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Update vendor
const updateVendor = async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json(updatedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//  Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add medicine to vendor
const addMedicineToVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const medicineData = req.body;

    // Check if vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Handle image upload if provided
    let imageUrl = null;
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'medollo/medicines' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload image' });
      }
    }

    // Create new medicine
    const medicine = new Medicine({
      ...medicineData,
      vendor: vendorId,
      imageUrl: imageUrl || medicineData.imageUrl
    });

    const savedMedicine = await medicine.save();

    // Add medicine to vendor's medicinesSupplied array
    vendor.medicinesSupplied.push(savedMedicine._id);
    await vendor.save();

    res.status(201).json({
      message: 'Medicine added successfully',
      medicine: savedMedicine
    });

  } catch (error) {
    console.error('Error adding medicine:', error);
    res.status(500).json({
      message: 'Failed to add medicine',
      error: error.message
    });
  }
};

// Get vendor's medicines
const getVendorMedicines = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendor = await Vendor.findById(vendorId).populate('medicinesSupplied');
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor.medicinesSupplied);

  } catch (error) {
    console.error('Error fetching vendor medicines:', error);
    res.status(500).json({
      message: 'Failed to fetch medicines',
      error: error.message
    });
  }
};

module.exports = {
  getVendors,
  createVendor,
  getVendorById,
  updateVendor,
  deleteVendor,
  addMedicineToVendor,
  getVendorMedicines,
  upload
};
