import axios from "axios";
import dotenv from "dotenv";
import script1 from "../../utils/.generateTrades.js";

dotenv.config();
const BASE_URL = "https://api.binance.com/api/v3";

async function fetchRecentTrades(symbol) {
  try {
    const response = await axios.get(`${BASE_URL}/trades`, {
      params: {
        symbol: symbol,
        limit: 500,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trades from Binance:", error.message);
    throw error;
  }
}

// it create new from utils/.generateTrades.js
const fetchRecentTradesMock = async (symbol) => {
  return script1.generateMockTrades(1000, symbol);
};

export default {
  fetchRecentTrades: fetchRecentTradesMock,
};
