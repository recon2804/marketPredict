const historyCache = new Map();
const CACHE_TTL = 15 * 60 * 1000;

const pendingRequests = new Map()
const quoteCache = new Map();



async function getMarketHistory(symbol) {

    if (historyCache.has(symbol)) {
        const cachedEntry = historyCache.get(symbol);
        const age = Date.now() - cachedEntry.timestamp;

        if(age < CACHE_TTL) {
            console.log(`CACHE HIT: ${symbol}`);
            return cachedEntry.data;
        }
    }

    if (pendingRequests.has(symbol)) {
        console.log(`PENDING HIT: ${symbol}`)
        return pendingRequests.get(symbol);
    }

    const requestPromise = fetchMarketHistory(symbol)

    pendingRequests.set(symbol, requestPromise)

    try {
        return await requestPromise
    } finally {
        pendingRequests.delete(symbol)
    }

}

async function fetchMarketHistory(symbol) {

    const apiKey = process.env.MARKET_API_KEY;
    const url = `https://www.alphavantage.co/query?symbol=${symbol}&apikey=${apiKey}&function=TIME_SERIES_DAILY&outputsize=compact`;

    console.log(`API FETCH: ${symbol}`);

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Alpha Vantage API chyba: ${response.status}`)
    }
    
    const data = await response.json()
    const timeSeries = data["Time Series (Daily)"];

    if (!timeSeries) {
        throw new Error("Historická data nejsou dostupná.");
    }

    const entries = Object.entries(timeSeries);
    const chartData = entries.map(entry => {
        const [date, prices] = entry;

        const closingPrice = Number(prices["4. close"]);

        return {
            time: date,
            value: closingPrice
        }
    })

    chartData.sort((a, b) => {
        return a.time.localeCompare(b.time);
    });

    historyCache.set(symbol, {
        data: chartData,
        timestamp: Date.now()
    });
    
    return chartData;
}

async function getMarketQuote(symbol) {

        if (quoteCache.has(symbol)) {
            const cachedEntry = quoteCache.get(symbol);
            const age = Date.now() - cachedEntry.timestamp

        if (age < CACHE_TTL) {
            console.log(`QUOTE CACHE HIT: ${symbol}`);

            return cachedEntry.data;
        }
    }

    if (pendingQuoteRequests.has(symbol)) {
        console.log(`PENDING QUOTE HIT: ${symbol}`);

        return pendingQuoteRequests.get(symbol);
    }

    const requestPromise = fetchMarketQuote(symbol)

    pendingQuoteRequests.set(symbol, requestPromise)

    try {
        const quoteData = await requestPromise;
        
        quoteCache.set(symbol, {
            data: quoteData,
            timestamp: Date.now()
        });

        return quoteData
        
    } finally {
        pendingQuoteRequests.delete(symbol)
    } 
}

async function fetchMarketQuote(symbol) {
    
    const apiKey = process.env.MARKET_API_KEY;

    const url = `https://www.alphavantage.co/query?symbol=${symbol}&apikey=${apiKey}&function=GLOBAL_QUOTE`

    const response = await fetch(url)
    console.log(`QUOTE API FETCH: ${symbol}`);

    if (!response.ok) {
        throw new Error(`Alpha Vantage API chyba: ${response.status}`)
    } 
    
    const data = await response.json()

    if (data["Note"] || data["Information"] || data["Error Message"] ) {
        throw new Error("Alpha Vantage: překročen limit API.");
    }

    const quote = data ["Global Quote"]

    if(!quote) {
        throw new Error("Alpha Vantage: API vrátilo chybovou zprávu.");
    }
    
    const price = Number(quote["05. price"])
    const changePercent = Number(quote["10. change percent"].replace("%", ""))

    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(changePercent)) {
        throw new Error("Neplatná cenová data.")
    }

    const quoteData = {
        symbol,
        price,
        changePercent
    };

    return quoteData
}

module.exports = { getMarketHistory, getMarketQuote};