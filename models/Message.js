import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
});

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      required: [true, 'Message type is required'],
      enum: {
        values: ['feedback', 'question', 'help', 'bug', 'other'],
        message: 'Invalid message type',
      },
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
    replies: [replySchema],
    ipAddress: {
      type: String,
      select: false, // Don't include in queries by default (privacy)
    },
    userAgent: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
messageSchema.index({ createdAt: -1 });
messageSchema.index({ type: 1, createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ email: 1 });

// Rate limiting index - to find recent messages from same IP
messageSchema.index({ ipAddress: 1, createdAt: -1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
