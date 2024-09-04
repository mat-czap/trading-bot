const trades = require("/docker-entrypoint-initdb.d/trades.json");

db = db.getSiblingDB("trading-bot");
db.createUser({
  user: "testuser",
  pwd: "testpassword",
  roles: [{ role: "readWrite", db: "trading-bot" }],
});

db.trades.insertMany(trades);
db.strategies.insertMany([
  {
    name: "BTCUSDT Buy Low",
    description: "Buy when BTCUSDT drops by 0.001%",
    buyThreshold: 0.00001,
    sellThreshold: 0.00002,
  },
  {
    name: "BTCUSDT Sell High",
    description: "Sell when BTCUSDT rises by 0.001%",
    buyThreshold: 0.000005,
    sellThreshold: 0.00001,
    isActive: true,
  },
]);
print("trade records have been inserted");
