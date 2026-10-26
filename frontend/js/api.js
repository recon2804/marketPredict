const API_BASE_URL = "http://localhost:3000";

export function fetchMarkets() {
    return apiGet("/api/markets");
}

export function fetchMarketBySymbol(symbol) {
    return apiGet(`/api/markets/${encodeURIComponent(symbol)}`);
}

async function apiGet(endpoint, signal = undefined) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal
    });

    if (!response.ok) {
        throw new Error(`HTTP chyba: ${response.status}`);
    }

    return await response.json();
}

export function fetchMarketHistory(symbol, signal) {
    return apiGet(`/api/markets/${encodeURIComponent(symbol)}/history`, signal);
}

// Testovací funkce pro ověření, že fetchMarketHistory funguje správně
async function testMarketHistory() {
    try {
        const history = await fetchMarketHistory("AAPL");

        console.log("Historie AAPL:", history);
        console.log("Počet záznamů:", history.length);

    } catch (error) {
        console.error("Chyba při načítání historie:", error);
    }
}

testMarketHistory();