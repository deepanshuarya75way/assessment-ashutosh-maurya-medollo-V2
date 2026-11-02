const mongoose = require('mongoose');

// Schema for individual medicine details inside the 'medicines' array
const medicineSchema = new mongoose.Schema({
    product_url: { type: String },
    scraped_at: { type: String },
    name: { type: String, required: true, index: true }, // Index for better search performance
    image_url: { type: String },
    mrp: { type: String },
    regularPrice: { type: String },
    memberPrice: { type: String },
    perUnit: { type: String },
    manufacturer: { type: String },
    composition: { type: String },
    pack_size: { type: String },
    description: { type: String },
    suggestions: [{
  name: String,
  product_url: String,
  image_url: String,
  price: String,
  mrp: String
}]
}, { _id: true }); // Ensure sub-documents have an _id for retrieval

// Main Brand Schema
const brandSchema = new mongoose.Schema({
    brand_name: { type: String, required: true },
    brand_url: { type: String },
    scraped_at: { type: String },
    medicines: [medicineSchema],
    // The 'suggestions' array structure is omitted for brevity in search, 
    // but you can add it back if you need to query it.
});

// Create a text index on the medicine name for future search optimizations
brandSchema.index({ 'medicines.name': 'text' });

module.exports = mongoose.model('Brand', brandSchema);
