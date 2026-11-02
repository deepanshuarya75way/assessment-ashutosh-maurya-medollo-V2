
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerificationOTP: String,
    phoneVerificationExpires: Date,
    address: {
      type: String,
      trim: true,
    },
    avatarUrl: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password is correct
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate OTP for phone verification
UserSchema.methods.generatePhoneVerificationOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.phoneVerificationOTP = otp;
  this.phoneVerificationExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return otp;
};

// Method to verify OTP
UserSchema.methods.verifyPhoneOTP = function (otp) {
  return this.phoneVerificationOTP === otp && 
         this.phoneVerificationExpires > Date.now();
};

module.exports = mongoose.model('User', UserSchema);