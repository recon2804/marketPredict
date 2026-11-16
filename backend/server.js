require("dotenv").config();

const express = require(`express`);
const app = express();
const port = Number(process.env.PORT) || 3000;
const cors = require("cors")
const { marketHistory } = require("./data/marketData");
const { getMarketHistory, getMarketQuote } = require("./services/marketService");

//MiddLeware
app.use(express.json());
app.use(cors());

//Demonstrační data
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

//Endpointy
//Kontrola stavu serveru
app.get("/api/health", (req, res) => {
    res.json({
    status: "ok",
    application: "MarketPredict",
    version: "1.0"
});
});

//Vrácení ceny konkrétního instrumentu
app.get("/api/markets/:symbol/quote", async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();

    try {
       const quote = await getMarketQuote(symbol)
        res.status(200).json(quote)
    } catch (error) {
        console.error(error)
        res.status(502).json({ error: "Nepodařilo se načíst cenová data." })
    }
});

// Vrácení všech instrumentů
app.get("/api/markets", async (req, res) => {

    try {
        const marketPromises = markets.map(async (instrument) => {
        const quote = await getMarketQuote(instrument.symbol);
        
        const updatedInstrument = {
            ...instrument,
            price: quote.price,
            changePercent: quote.changePercent
        };

        return updatedInstrument
});

    const results = await Promise.allSettled(marketPromises);

    const updatedMarkets = results.map((result, index) => {

    if (result.status === "fulfilled") {
        return result.value;
    }

    return {
        ...markets[index],
        price: null,
        changePercent: null
    };

});

    res.status(200).json(updatedMarkets)

    } catch (error) {
        console.error(error)
        res.status(502).json({ error: "Nepodařilo se načíst tržní data."})
    }
   
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

//Vrácení historie grafu
app.get("/api/markets/:symbol/history",  async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();

    try {
       const history = await getMarketHistory(symbol)
        res.status(200).json(history);

    } catch (error) {
        console.error(error)

        res.status(502).json({ error: "Nepodařilo se načíst historická data." })
    }

});

//Spuštění serveru
app.listen(port, () => console.log("Listening on port " + port + "..."));