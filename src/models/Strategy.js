import mongoose from "mongoose";

const StrategySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  buyThreshold: { type: Number, required: true },
  sellThreshold: { type: Number, required: true },
  tradeQuantity: { type: Number },
  isActive: { type: Boolean, default: false },
});

const Strategy = mongoose.model("Strategy", StrategySchema);

export default Strategy;
