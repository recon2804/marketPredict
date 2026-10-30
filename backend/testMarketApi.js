require("dotenv").config();

const apiKey = process.env.MARKET_API_KEY;
const symbol = "AAPL";
const url = `https://www.alphavantage.co/query?symbol=${symbol}&apikey=${apiKey}&function=TIME_SERIES_DAILY&outputsize=compact`;

async function testMarketApi() {
    const response = await fetch(url)
    const data = await response.json()

    console.log(data);
}

testMarketApi();