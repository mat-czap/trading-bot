import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Function to generate mock trades
function generateMockTrades(count, symbol) {
  const trades = [];
  const basePrice = 40000;
  const baseQty = 0.001;
  const baseTime = Date.now();

  for (let i = 0; i < count; i++) {
    const id = 123456789 + i;
    const price = (basePrice + i * 0.001).toFixed(2);
    const qty = (baseQty + i * 0.001).toFixed(3);
    const quoteQty = (price * qty).toFixed(2);
    const time = baseTime + i * 1000;
    const isBuyerMaker = Math.random() < 0.5;
    const isBestMatch = true;

    trades.push({
      id,
      symbol,
      price: price.toString(),
      quantity: qty.toString(),
      quoteQty: quoteQty.toString(),
      time,
      isBuyerMaker,
      isBestMatch,
    });
  }

  return trades;
}

// Helper to check if this file is run from the terminal directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if script is executed directly via terminal
if (process.argv[1] === __filename) {
  const symbol = process.argv[2] || "BTCUSDT"; // Default to "BTCUSDT" if no symbol is passed
  const count = parseInt(process.argv[3], 10) || 500; // Default to 500 if no count is passed

  const trades = generateMockTrades(count, symbol);

  // Write the trades to utils/trades.json
  const outputFile = path.resolve(__dirname, "trades.json");
  fs.writeFileSync(outputFile, JSON.stringify(trades, null, 2));
  console.log(
    `${count} mock trade records for symbol ${symbol} saved to ${outputFile}`
  );
}

export default { generateMockTrades };
