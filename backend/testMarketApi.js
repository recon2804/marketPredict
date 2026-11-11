require("dotenv").config();

const apiKey = process.env.MARKET_API_KEY;
const symbol = "AAPL";
const url = `https://www.alphavantage.co/query?symbol=${symbol}&apikey=${apiKey}&function=TIME_SERIES_DAILY&outputsize=compact`;

async function testMarketApi() {
    const response = await fetch(url);
    const data = await response.json();

    const timeSeries = data["Time Series (Daily)"];

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
    
    console.log("První tři:", chartData.slice(0, 3));
    console.log("Poslední tři:", chartData.slice(-3));
}

testMarketApi();