const express = require("express");
const { getVendors, createVendor, getVendorById, updateVendor, deleteVendor, addMedicineToVendor, getVendorMedicines, upload } = require("../controllers/vendor.controller.js");

const router = express.Router();

router.get("/", getVendors);
router.post("/", createVendor); // <-- this must match frontend POST
router.get("/:id", getVendorById);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

// Medicine management routes
router.post("/:id/medicines", upload.single('image'), addMedicineToVendor);
router.get("/:id/medicines", getVendorMedicines);

module.exports = router;
