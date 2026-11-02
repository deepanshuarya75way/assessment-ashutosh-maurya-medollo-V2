
const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// GET /api/random/med?limit=10&category=someCategory
router.get('/med', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;

    const placeholderImage = "https://placehold.co/160x160/FEE2E2/DC2626?text=No+Image";

    const matchStage = {
      'medicines.image_url': {
        $exists: true,
        $ne: null,
        $nin: ["", placeholderImage]  // exclude empty strings & placeholder
      },
      ...(category && { 'medicines.category': category })
    };

    const randomMedicines = await Brand.aggregate([
      { $unwind: '$medicines' },
      { $match: matchStage },
      { $sample: { size: limit } },
      {
        $project: {
          _id: '$medicines._id',
          name: '$medicines.name',
          brand_name: '$brand_name',
          product_url: '$medicines.product_url',
          image_url: '$medicines.image_url',
          mrp: '$medicines.mrp',
          regularPrice: '$medicines.regularPrice',
          memberPrice: '$medicines.memberPrice',
          manufacturer: '$medicines.manufacturer',
          perUnit: '$medicines.perUnit',
          composition: '$medicines.composition',
          pack_size: '$medicines.pack_size',
          description: '$medicines.description',
          scraped_at: '$medicines.scraped_at',
          suggestions: '$medicines.suggestions'
        }
      }
    ]);

    // Double-check filtering in case any null slips through (safety net)
    const filteredMedicines = randomMedicines.filter(
      m => m.image_url && m.image_url.trim() !== '' && m.image_url !== placeholderImage
    );

    console.log(`✅ Random results: ${filteredMedicines.length} medicines found`);
    res.json(filteredMedicines);

  } catch (err) {
    console.error('❌ Error in random medicines:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});


module.exports = router;
