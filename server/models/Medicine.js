const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  productName: {
    type: String,
    required: true,
    index: true
  },
  brand: {
    type: String,
    required: true,
    index: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  compositionName: {
    type: String,
    required: true
  },
  molecules: {
    type: String,
    required: true
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  packSize: {
    type: Number,
    required: true,
    min: 1
  },
  displayPrice: {
    type: Number,
    required: true,
    min: 0
  },
  isSellable: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y'
  },
  isPrescriptionRequired: {
    type: String,
    enum: ['Y', 'N'],
    default: 'N'
  },
  auditForm: {
    type: String,
    required: true
  },
  productFormName: {
    type: String,
    required: true
  },
  switchProductIds: {
    type: String
  },
  packaging: {
    type: String,
    required: true
  },
  saleUnit: {
    type: String,
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  productLongDescription: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  // Additional fields for enhanced functionality
  category: {
    type: String,
    index: true
  },
  tags: [{
    type: String
  }],
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better search performance
medicineSchema.index({ productName: 'text', compositionName: 'text', molecules: 'text' });
medicineSchema.index({ brand: 1, category: 1 });
medicineSchema.index({ mrp: 1 });
medicineSchema.index({ isSellable: 1, isActive: 1 });
medicineSchema.index({ isPrescriptionRequired: 1 });

// Virtual for discount calculation
medicineSchema.virtual('discount').get(function() {
  if (this.mrp && this.displayPrice && this.mrp > this.displayPrice) {
    return Math.round(((this.mrp - this.displayPrice) / this.mrp) * 100);
  }
  return 0;
});

// Virtual for per unit price
medicineSchema.virtual('perUnitPrice').get(function() {
  if (this.displayPrice && this.saleUnit) {
    return (this.displayPrice / parseInt(this.saleUnit)).toFixed(2);
  }
  return null;
});

// Ensure virtual fields are serialized
medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Medicine', medicineSchema);
