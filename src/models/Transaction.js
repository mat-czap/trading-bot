import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ["buy", "sell"], required: true },
  strategyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Strategy",
    required: true,
  },
  time: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
