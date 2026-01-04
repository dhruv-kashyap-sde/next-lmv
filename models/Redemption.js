const { default: mongoose } = require("mongoose");

const RedemptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user ID"],
  },
  voucherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voucher",
    required: [true, "Please provide a voucher ID"],
  },
  ClaimedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Redemption || mongoose.model("Redemption", RedemptionSchema);