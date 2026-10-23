//Mocking data for instruments
const mockMarketData = [
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