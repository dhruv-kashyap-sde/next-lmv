import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a voucher title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  termsAndConditions: {
    type: String,
    required: [true, 'Terms and conditions are required']
  },
  stepsToUse: {
    type: String,
    required: [true, 'Steps to use are required']
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  minOrder: {
    type: Number,
    required: [true, 'Minimum order value is required'],
    min: 0
  },
  code: {
    type: String,
    required: [true, 'Voucher code is required'],
    select: false, // Don't return code in queries
    trim: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Please provide a brand'],
  },
  image: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
VoucherSchema.index({ brand: 1, category: 1, isActive: 1 });
VoucherSchema.index({ expiryDate: 1 });
  
export default mongoose.models.Voucher || mongoose.model('Voucher', VoucherSchema);
