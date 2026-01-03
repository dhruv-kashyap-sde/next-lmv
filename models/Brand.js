import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a brand name"],
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
    },
    vouchers: [{ 
      type: mongoose.Schema.Types.ObjectId,
        ref: "Voucher",
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
