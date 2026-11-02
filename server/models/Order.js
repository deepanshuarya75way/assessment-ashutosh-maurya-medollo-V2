const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express'],
    default: 'standard'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0
  },
  taxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  },
  estimatedDelivery: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate estimated delivery before saving
orderSchema.pre('save', function(next) {
  if (!this.estimatedDelivery) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (this.shippingMethod === 'express' ? 2 : 3));
    this.estimatedDelivery = deliveryDate;
  }
  next();
});

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);