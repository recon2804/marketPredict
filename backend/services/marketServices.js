async function getMarketHistory(symbol) {
    const apiKey = process.env.MARKET_API_KEY;

    const url = `https://www.alphavantage.co/query?symbol=${symbol}&apikey=${apiKey}&function=TIME_SERIES_DAILY&outputsize=compact`;

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

    return chartData;
}

module.exports = {
    getMarketHistory
};