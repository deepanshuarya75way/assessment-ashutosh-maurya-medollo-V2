const mongoose = require('mongoose');

const UserMedicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medicine: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      brand_name: {
        type: String,
        trim: true,
      },
      dosage: {
        type: String,
        trim: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      image: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    reminder: {
      enabled: {
        type: Boolean,
        default: false,
      },
      time: {
        type: String, // Store as "HH:MM" format
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily',
      },
    },
    dosageSchedule: {
      enabled: {
        type: Boolean,
        default: false,
      },
      paused: {
        type: Boolean,
        default: false,
      },
      slots: [
        {
          slotName: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'bedtime', 'custom'],
            default: 'morning',
          },
          label: {
            type: String,
            default: 'Morning',
          },
          time: {
            type: String,
            default: 'Morning',
          },
          time: {
            type: String,
            default: '08:00',
          },
          pillCount: {
            type: Number,
            default: 1,
            min: 0.25,
          },
          foodRequirement: {
            type: String,
            enum: ['before_food', 'after_food', 'with_food', 'empty_stomach', 'no_restriction'],
            default: 'after_food'
          },
          instructions: {
            type: String,
            default: '',
          },
          paused: {
            type: Boolean,
            default: false,
          },
          startDate: {
            type: Date,
            default: Date.now,
          }, 
          endDate: {
            type: Date,
          }
        }
      ]
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    addedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
UserMedicineSchema.index({ user: 1, status: 1 });
UserMedicineSchema.index({ user: 1, addedDate: -1 });

module.exports = mongoose.model('UserMedicine', UserMedicineSchema);
