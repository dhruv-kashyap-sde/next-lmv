import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['signup', 'login', 'password-reset'],
    required: true,
  },
  // Store pending user data for signup
  userData: {
    name: String,
    password: String,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  maxAttempts: {
    type: Number,
    default: 3,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index - auto-delete expired documents
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash OTP before saving
OtpSchema.pre('save', async function () {
  if (!this.isModified('otp')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
});

// Method to verify OTP
OtpSchema.methods.verifyOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

// Static method to generate 6-digit OTP
OtpSchema.statics.generateOtp = function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Index for efficient lookups
OtpSchema.index({ email: 1, purpose: 1 });

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
