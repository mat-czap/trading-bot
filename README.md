# trading-bot

```npm
npm install
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
