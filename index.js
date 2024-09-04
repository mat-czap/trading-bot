import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import tradePollingService from "./src/services/tradePollingService.js";

dotenv.config();

const PORT = process.env.PORT || 6000;
const CRYPTO_SYMBOL = process.env.CRYPTO_SYMBOL || "BTCUSDT";

console.log("CRYPTO_SYMBOL:", CRYPTO_SYMBOL);
console.log("PORT", PORT);

const startServer = async () => {
  try {
    const conn = await connectDB();
    console.log("Connected to MongoDB:", conn.connection.host);

    const pollInterval = process.env.POLL_INTERVAL || 60000;
    tradePollingService.startTradePolling(pollInterval, CRYPTO_SYMBOL);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during application startup:", error.message);
    process.exit(1);
  }
};

startServer();
