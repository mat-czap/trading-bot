import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema({
  symbol: { type: String, index: true },
  price: Number,
  quantity: Number,
  tradeId: { type: Number, unique: true },
  timestamp: { type: Date, index: true, default: Date.now },
  isBuyer: Boolean,
});

export default mongoose.model("Trade", TradeSchema);
