import express from "express";
import dotenv from "dotenv";
import strategyService from "./services/strategyService.js";
import asyncHandler from "../utils/asyncHandler.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get(
  "/api/strategies",
  asyncHandler(async (req, res) => {
    console.log("GET /api/strategies");
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const strategies = await strategyService.getManyStrategies(limit, offset);

    if (!strategies.length) {
      return res
        .status(404)
        .json({ success: false, message: "No strategies found" });
    }

    const results = await Promise.all(
      strategies.map(async (strategy) => {
        const { totalProfit, totalTransactions } =
          await strategyService.calculateStrategyIdPerformance(strategy._id);
        return {
          strategyId: strategy._id,
          totalProfit,
          totalTransactions,
        };
      })
    );

    res.status(200).json({ success: true, results });
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
