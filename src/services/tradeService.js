import Trade from "../models/Trade.js";

const saveTrades = async (trades) => {
  if (!trades || trades.length === 0) {
    return;
  }
  try {
    await Trade.insertMany(trades, { ordered: false });
    console.log(`${trades.length} trades have been saved to the database.`);
  } catch (error) {
    console.error("Error saving trades to MongoDB:", error.message);
    throw Error("Error saving trades to MongoDB.");
  }
};

const getTrades = async (symbol, lastProcessedTime) => {
  try {
    return await Trade.find({
      symbol,
      timestamp: { $gt: lastProcessedTime },
    })
      .sort({ timestamp: 1 })
      .exec();
  } catch (error) {
    console.error("Error getting trades from MongoDB:", error.message);
    return [];
  }
};

export default {
  saveTrades,
  getTrades,
};
