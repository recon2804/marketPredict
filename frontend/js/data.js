//Mocking data for instruments
const marketData = [
    {
        id: 1,
        symbol: "AAPL",
        name: "Apple Inc.",
        type: "stock",
        price: 258.40,
        change: 1.82
    },
    {
        id: 2,
        symbol: "MSFT",
        name: "Microsoft",
        type: "stock",
        price: 512.70,
        change: 0.94
    },
    {
        id: 3,
        symbol: "NVDA",
        name: "NVIDIA",
        type: "stock",
        price: 189.30,
        change: -2.15
    },
    {
        id: 4,
        symbol: "SPY",
        name: "S&P 500 ETF",
        type: "etf",
        price: 675.20,
        change: 0.63
    }
];

//Mocking data for graph
const appleHistory = [
        { time: "2026-10-01", value: 240 },
        { time: "2026-10-02", value: 244 },
        { time: "2026-10-05", value: 247 },
        { time: "2026-10-06", value: 251 },
        { time: "2026-10-07", value: 248 },
        { time: "2026-10-08", value: 255 },
        { time: "2026-10-09", value: 253 },
        { time: "2026-10-12", value: 258.4 }
    ]

const marketHistory = {
    AAPL: generateMarketHistory(200, 365),
    MSFT: generateMarketHistory(400, 365),
    NVDA: generateMarketHistory(150, 365),
    SPY: generateMarketHistory(550, 365)
};

//Mocking data for graph
function generateMarketHistory(startPrice, days) {
    let currentPrice = startPrice;
    const history = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() - i);
        const dayOfWeek = date.getUTCDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            continue;
        }

        const formattedDate = date.toISOString().split("T")[0];
        const dailyChange = (Math.random() - 0.5) * 4;
        currentPrice = Math.max(0, currentPrice + dailyChange);
        
        const roundedPrice = Math.round(currentPrice * 100) / 100;

        history.push({
            time: formattedDate,
            value: roundedPrice
        });
    }

    return history;
}

const testHistory = generateMarketHistory(200, 10);

console.table(testHistory);
console.log(testHistory.length);

console.log("AAPL:", marketHistory.AAPL.length);
console.log("MSFT:", marketHistory.MSFT.length);