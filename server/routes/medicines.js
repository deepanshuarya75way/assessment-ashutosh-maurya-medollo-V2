const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// @route   GET /api/medicines/paginated
// @desc    Get paginated medicines with filtering and sorting
// @access  Public
router.get('/paginated', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category = 'all',
      search = '',
      sortBy = 'popularity',
      priceMin = 0,
      priceMax = 2000
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build match stage for aggregation
    let matchStage = {
      'medicines.mrp': { $exists: true, $ne: null, $ne: '' }
    };

    // Add category filter
    if (category !== 'all' && !category.startsWith('divider-')) {
      if (category === 'popular') {
        // For popular, we'll sort by reviews later
        matchStage = {
          ...matchStage,
          'medicines.reviews': { $gte: 10 } // Assuming reviews field exists
        };
      } else {
        matchStage['brand_name'] = category;
      }
    }

    // Add search filter
    if (search && search.trim()) {
      matchStage['medicines.name'] = {
        $regex: search.trim(),
        $options: 'i'
      };
    }

    // Add price range filter
    matchStage['medicines.mrp'] = {
      ...matchStage['medicines.mrp'],
      $gte: parseFloat(priceMin),
      $lte: parseFloat(priceMax)
    };

    // Build aggregation pipeline
    const pipeline = [
      { $unwind: '$medicines' },
      { $match: matchStage },
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
    ];

    // Add sorting based on sortBy parameter
    let sortStage = {};
    switch (sortBy) {
      case 'price-low':
        sortStage = { mrp: 1 };
        break;
      case 'price-high':
        sortStage = { mrp: -1 };
        break;
      case 'rating':
        sortStage = { rating: -1 };
        break;
      case 'newest':
        sortStage = { scraped_at: -1 };
        break;
      case 'popularity':
      default:
        sortStage = { reviews: -1 };
        break;
    }

    // Add image URL sorting for "all" category
    if (category === 'all') {
      // First sort by image priority, then by the selected sort criteria
      pipeline.push({
        $addFields: {
          imagePriority: {
            $cond: {
              if: {
                $or: [
                  { $eq: ['$image_url', null] },
                  { $eq: ['$image_url', ''] },
                  { $eq: ['$image_url', 'https://placehold.co/300x300/FF385C/FFFFFF/png?text=Medicine'] }
                ]
              },
              then: 3, // Lowest priority for null/placeholder
              else: {
                $cond: {
                  if: { $regexMatch: { input: '$image_url', regex: '^https://static2\\.medplusmart\\.com/' } },
                  then: 2, // Medium priority for medplusmart
                  else: 1  // Highest priority for normal images
                }
              }
            }
          }
        }
      });
      
      sortStage = { imagePriority: 1, ...sortStage };
    }

    pipeline.push({ $sort: sortStage });

    // Get total count for pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Brand.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Add pagination
    pipeline.push(
      { $skip: skip },
      { $limit: limitNum }
    );

    // Execute aggregation
    const medicines = await Brand.aggregate(pipeline);

    // Process the results to match frontend format
    const processedMedicines = medicines.map((medicine, index) => ({
      id: `med-${skip + index}`,
      name: medicine.name?.replace(" - MedPlus", "").replace(" Online at b", "") || "Medicine",
      image: medicine.image_url || "https://placehold.co/300x300/FF385C/FFFFFF/png?text=Medicine",
      price: parseFloat(medicine.mrp) || 0,
      discountPrice: parseFloat(medicine.regularPrice) || null,
      discount: medicine.mrp && medicine.regularPrice
        ? `${Math.round((1 - parseFloat(medicine.regularPrice) / parseFloat(medicine.mrp)) * 100)}%`
        : null,
      description: medicine.composition || "Medicine",
      rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 200) + 5,
      category: medicine.brand_name,
      stock: Math.floor(Math.random() * 100) + 5,
      tags: [medicine.composition || "Medicine"],
      perUnit: medicine.perUnit || "1 Unit/pack",
      manufacturer: medicine.manufacturer || medicine.brand_name,
    }));

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: processedMedicines,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error fetching paginated medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/medicines/categories
// @desc    Get all available categories/brands
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const brands = await Brand.find({}, 'brand_name').sort({ brand_name: 1 });
    
    const categories = [
      { id: "all", name: "All Products", type: "special" }
    ];

    // Add popular brands section
    categories.push({ id: "divider-popular", name: "Popular Brands", type: "divider" });
    categories.push({ id: "popular", name: "Popular", type: "special" });

    // Add regular brands
    categories.push({ id: "divider-brands", name: "All Brands", type: "divider" });
    
    brands.forEach(brand => {
      categories.push({
        id: brand.brand_name,
        name: brand.brand_name,
        type: "brand"
      });
    });

    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;

