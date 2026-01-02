import mongoose from 'mongoose';

const AdViewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
  pointsEarned: {
    type: Number,
    default: 10,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for analytics
AdViewSchema.index({ user: 1, createdAt: -1 });
AdViewSchema.index({ completed: 1 });

export default mongoose.models.AdView || mongoose.model('AdView', AdViewSchema);
