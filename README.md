# trading-bot (wip)

```npm
npm install
```

# add envs .env
```
POLL_INTERVAL=10000
CRYPTO_SYMBOL=BTCUSDT
PORT=6000
```

# To run:

```
node ./utils/.generateTrades.js
```

```
docker-compose up --build
```

(db is not cleaning up afterwards)

# Check strategies performance

endpoint GET api/strategies

```{
    "success": true,
    "results": [
        {
            "strategyId": "66d8086f22ea7f15afc76c80",
            "totalProfit": 0,
            "totalTransactions": 20
        }
    ]
}
```
