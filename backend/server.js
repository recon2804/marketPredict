const express = require(`express`);
const app = express();
const port = 3000;
const cors = require("cors")

//MiddLeware
app.use(express.json());
app.use(cors());

//Endpointy
const markets = [
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

//Kontrola stavu serveru
app.get("/api/health", (req, res) => {
    res.json({
    status: "ok",
    application: "MarketPredict",
    version: "1.0"
});
});

//Vrácení všech instrumentů
app.get("/api/markets", (req, res) => {
    res.json(markets)
});

//Vrácení konrétního instrumentu
app.get("/api/markets/:symbol", (req, res) => {
    const symbol = req.params.symbol.toUpperCase();

    const instrument = markets.find((oneInstrument) => {
        return oneInstrument.symbol === symbol;
    });

    if (!instrument) {
        return res.status(404).json({
            error: "Instrument nebyl nalezen"
        });
    }

    res.json(instrument);
});

//Spuštění serveru
app.listen(port, () => console.log("Listening on port " + port + "..."));