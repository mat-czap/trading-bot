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

export default generateMockTrades;
