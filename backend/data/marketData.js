function generateMarketHistory(startPrice, days) {
    let currentPrice = startPrice;
    const history = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() - i);

        if (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
            continue;
        }

        const formattedDate = date.toISOString().split("T")[0];
        const dailyChange = (Math.random() - 0.5) * 4;

        currentPrice = Math.max(0.01, currentPrice + dailyChange);

        history.push({
            time: formattedDate,
            value: Math.round(currentPrice * 100) / 100
        });
    }

    return history;
}

const marketHistory = {
    AAPL: generateMarketHistory(200, 365),
    MSFT: generateMarketHistory(400, 365),
    NVDA: generateMarketHistory(150, 365),
    SPY: generateMarketHistory(550, 365)
};

module.exports = {marketHistory};