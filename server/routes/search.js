


// routes/search.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Brand = require('../models/Brand');

// @route   GET /api/search/medicines?query=...
// @desc    Search for medicines by name in the nested array
// @access  Public
router.get('/medicines', async (req, res) => {
  try {
    const { query } = req.query;
   

    if (!query || query.trim() === '') {
      return res.status(200).json([]);
    }

    const brands = await Brand.find(
      { 'medicines.name': { $regex: query, $options: 'i' } },
      { 'medicines': 1, 'brand_name': 1 }
    );
    const medicines = brands.flatMap(brand =>
      brand.medicines
        .filter(med => med.name.toLowerCase().includes(query.toLowerCase()))
        .map(med => ({
          _id: med._id.toString(),
          name: med.name,
          brand_name: brand.brand_name,
           product_url: med.product_url || null,
          image_url: med.image_url || null,
          mrp: med.mrp || null,
          regularPrice: med.regularPrice || null,
          memberPrice: med.memberPrice || null,
          manufacturer: med.manufacturer || null,
          perUnit: med.perUnit || null,
          composition: med.composition || null,
          pack_size: med.pack_size || null,
          description: med.description || null,
          scraped_at: med.scraped_at || null,
          suggestions: med.suggestions || [],
        }))
    );
    console.log(`Search results: ${medicines.length} medicines found`);
    res.json(medicines);
  } catch (err) {
    console.error('Error in search:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});



router.get('/medicines/:id', async (req, res) => {
    try {
        const medicineId = req.params.id;

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(medicineId)) {
            return res.status(400).json({ msg: 'Invalid medicine ID format' });
        }
        
        // Convert string ID to ObjectId for proper aggregation matching
        const objectId = new mongoose.Types.ObjectId(medicineId);

        // Aggregation to find and project only the nested medicine document
        const result = await Brand.aggregate([
            { $unwind: "$medicines" },
            {
                $match: {
                    // Try to match both ObjectId and String representations just in case of data integrity issues
                    $or: [
                        { "medicines._id": objectId },
                        { "medicines._id": medicineId }
                    ]
                }
            },
            // Promote the nested 'medicines' document to the root of the output document
            {
                $replaceRoot: { newRoot: "$medicines" } 
            }
        ]);

        if (result.length === 0) {
            return res.status(404).json({ msg: 'Medicine not found' });
        }
        
        // Return the single medicine object
        res.json(result[0]);
    } catch (err) {
        console.error("Error fetching medicine details:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/search/all
// @desc    Get all medicines (limited to 30)
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const results = await Brand.aggregate([
      { $unwind: '$medicines' },
      {
        $project: {
          _id: '$medicines._id',
          name: '$medicines.name',
          brand_name: '$brand_name',
          price: '$medicines.regularPrice', // Adjusted to match schema
          image: '$medicines.image_url',
          product_url: '$medicines.product_url'
        }
      },
      { $limit: 30 }
    ]);

    console.log(`All medicines: ${results.length} medicines returned`);
    res.json(results);
  } catch (err) {
    console.error('Error fetching all medicines:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;