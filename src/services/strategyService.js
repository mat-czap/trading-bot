import Transaction from "../models/Transaction.js";
import Strategy from "../models/Strategy.js";
import { get } from "mongoose";

const applyTradingStrategy = async (symbol, newTrades) => {
  const strategies = await Strategy.find({ isActive: true }).exec();

  if (!strategies.length) {
    console.log("No active strategies found.");
    return;
  }

  for (const strategy of strategies) {
    await applyStrategyToTrades(strategy, newTrades, symbol);
  }

  return newTrades[newTrades.length - 1].timestamp;
};

const applyStrategyToTrades = async (strategy, trades, symbol) => {
  let lastTrade = null;
  const bulkOperations = [];

  const tradeIds = trades.map((trade) => trade.tradeId);

  const existingTransactions = await Transaction.find({
    symbol,
    tradeId: { $in: tradeIds },
    strategyId: strategy._id,
  }).exec();

  const existingTradeIds = new Set(
    existingTransactions.map((tx) => tx.tradeId)
  );

  const lastTransaction = await Transaction.findOne({
    symbol,
    strategyId: strategy._id,
  })
    .sort({ time: -1 })
    .exec();

  for (const trade of trades) {
    if (lastTrade) {
      const priceChange = (trade.price - lastTrade.price) / lastTrade.price;

      const transactionType =
        priceChange <= -strategy.buyThreshold
          ? "buy"
          : priceChange >= strategy.sellThreshold
          ? "sell"
          : null;

      if (
        transactionType === "buy" &&
        lastTransaction &&
        lastTransaction.type === "buy"
      ) {
        continue;
      }

      if (transactionType && !existingTradeIds.has(trade.tradeId)) {
        bulkOperations.push({
          insertOne: {
            document: {
              symbol,
              price: trade.price,
              type: transactionType,
              strategyId: strategy._id,
              tradeId: trade.tradeId,
              quantity: strategy.tradeQuantity || trade.quantity,
              time: trade.timestamp,
            },
          },
        });
      }
    }

    lastTrade = trade;
  }

  if (bulkOperations.length > 0) {
    await Transaction.bulkWrite(bulkOperations);
    console.log(`${bulkOperations.length} transactions processed.`);
  }
};
const calculateStrategyIdPerformance = async (strategyId) => {
  const transactions = await Transaction.find({ strategyId })
    .sort({ time: 1 })
    .exec();

  if (!transactions.length) {
    console.log(`Strategy with id ${strategyId} not found.`);
    return { strategyId };
  }

  let totalProfit = 0;
  let currentPosition = null; // Track the last buy transaction

  for (const transaction of transactions) {
    console.log("Processing transaction:", transaction);

    if (transaction.type === "buy") {
      // If already holding a position, this would overwrite it.
      // Add a check if you want to avoid overwriting positions.
      currentPosition = {
        price: transaction.price,
        quantity: transaction.quantity,
      };
      console.log(
        `Bought at price: ${transaction.price}, Quantity: ${transaction.quantity}`
      );
    } else if (transaction.type === "sell" && currentPosition) {
      // Calculate profit only when a sell follows a buy
      const profit =
        (transaction.price - currentPosition.price) * currentPosition.quantity;
      totalProfit += profit;
      console.log(
        `Sold at price: ${transaction.price}, Buy price: ${currentPosition.price}, Quantity: ${currentPosition.quantity}, Profit: ${profit}`
      );
      // After selling, reset the currentPosition
      currentPosition = null;
    }
  }

  console.log(`Total profit for strategy ${strategyId}: ${totalProfit}`);
  return { strategyId, totalProfit, totalTransactions: transactions.length };
};

const getManyStrategies = async (limit, offset) => {
  try {
    return await Strategy.find({ isActive: true })
      .skip(offset)
      .limit(limit)
      .exec();
  } catch (error) {
    console.error("Error fetching strategies", error);
    return [];
  }
};

export default {
  applyTradingStrategy,
  calculateStrategyIdPerformance,
  getManyStrategies,
};
