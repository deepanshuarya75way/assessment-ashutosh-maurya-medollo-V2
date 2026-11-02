const express = require('express');
const router = express.Router();
const UserMedicine = require('../models/UserMedicine');
const { protect } = require('../middleware/auth.middleware');

// Get all medicines for a user
router.get('/', protect, async (req, res) => {
  try {
    const medicines = await UserMedicine.find({ 
      user: req.user.id,
      status: { $ne: 'completed' }
    }).sort({ addedDate: -1 });
    
    res.json({
      success: true,
      data: medicines,
      count: medicines.length
    });
  } catch (error) {
    console.error('Error fetching user medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medicines'
    });
  }
});

// Add a new medicine to user's list
router.post('/', protect, async (req, res) => {
  try {
    const { medicine, notes, reminder } = req.body;
    
    // Check if medicine already exists for this user
    const existingMedicine = await UserMedicine.findOne({
      user: req.user.id,
      'medicine.name': medicine.name,
      status: 'active'
    });
    
    if (existingMedicine) {
      return res.status(400).json({
        success: false,
        message: 'Medicine already exists in your list'
      });
    }
    
    const userMedicine = new UserMedicine({
      user: req.user.id,
      medicine,
      notes,
      reminder: reminder || { enabled: false }
    });
    
    await userMedicine.save();
    
    res.status(201).json({
      success: true,
      data: userMedicine,
      message: 'Medicine added successfully'
    });
  } catch (error) {
    console.error('Error adding medicine:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add medicine'
    });
  }
});

// Update a medicine
router.put('/:id', protect, async (req, res) => {
  try {
    const { notes, reminder, status, quantity } = req.body;
    
    const userMedicine = await UserMedicine.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        $set: {
          ...(notes !== undefined && { notes }),
          ...(reminder !== undefined && { reminder }),
          ...(status !== undefined && { status }),
          ...(quantity !== undefined && { 'medicine.quantity': quantity })
        }
      },
      { new: true }
    );
    
    if (!userMedicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    
    res.json({
      success: true,
      data: userMedicine,
      message: 'Medicine updated successfully'
    });
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update medicine'
    });
  }
});

// Remove a medicine from user's list
router.delete('/:id', protect, async (req, res) => {
  try {
    const userMedicine = await UserMedicine.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!userMedicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Medicine removed successfully'
    });
  } catch (error) {
    console.error('Error removing medicine:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove medicine'
    });
  }
});

// Get medicine statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await UserMedicine.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$medicine.price', '$medicine.quantity'] } }
        }
      }
    ]);
    
    const totalMedicines = await UserMedicine.countDocuments({ user: req.user._id });
    const activeMedicines = await UserMedicine.countDocuments({ 
      user: req.user._id, 
      status: 'active' 
    });
    
    res.json({
      success: true,
      data: {
        totalMedicines,
        activeMedicines,
        completedMedicines: totalMedicines - activeMedicines,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching medicine stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medicine statistics'
    });
  }
});

module.exports = router;
