const mongoose = require('mongoose');

const DoseLogSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
    index: true
  },
  userMedicine:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'UserMedicine',
    required:true,
    index: true
  },
  medicineName:{
    type: String,
    required:true,
    trim: true
  },
  scheduledDate:{
    type: String,
    required:true,
    index: true
  },
  slotId:{
    type:String,
    default: ''
  },
  slotName:{
    type: String,
    required:true,
    enum: ['morning', 'afternoon', 'evening', 'bedtime', 'custom'],
    default:'morning'
  },
  slotLabel:{
    type:String,
    default: 'Morning'
  },
  scheduledTime:{
    type: String,
    required:true,
  },
  pillCount:{
    type: Number,
    default: 1,
    min: 0.25,
  },
  foodRequirement: {
    type: String,
    enum:['before_food', 'after_food', 'with_food', 'empty_stomach','no_restriction'],
    default:'after_food'
  },
  status:{
    type:String,
    enum:['pending', 'taken', 'skipped'],
    default:'pending'
  },
  takenAt:{
    type:Date
  },
  notes:{
    type:String,
    deault:'',
    trim:true,
  },
},{
  timestamps: true,
});

DoseLogSchema.index({user: 1, userMedicine: 1, scheduledDate:1, slotName: 1, scheduledTime: 1}, {unique: true});
DoseLogSchema.index({user:1, scheduledDate:1});

module.exports = mongoose.model('DoseLog', DoseLogSchema);