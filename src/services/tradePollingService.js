import binanceService from "./binanceService.js";
import strategyService from "./strategyService.js";
import tradeService from "./tradeService.js";

let lastProcessedTime = 0;

const tradePollingService = {
  startTradePolling: (pollInterval, symbol) => {
    setInterval(async () => {
      console.log(`Polling for new trades for symbol: ${symbol}...`);
      try {
        const trades = await binanceService.fetchRecentTrades(symbol);

        await tradeService.saveTrades(trades);

        const savedTrades = await tradeService.getTrades(
          symbol,
          lastProcessedTime
        );

        if (savedTrades.length > 0) {
          lastProcessedTime =
            (await strategyService.applyTradingStrategy(symbol, savedTrades)) ||
            lastProcessedTime;
          console.log(
            "Trades fetched, saved, and strategy applied. New lastProcessedTime:",
            lastProcessedTime
          );
        } else {
          console.log("No new trades to process.");
        }
      } catch (error) {
        console.error("Error during scheduled trade fetch:", error.message);
      }
    }, pollInterval);
  },
};

export default tradePollingService;
