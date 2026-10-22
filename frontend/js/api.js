const API_BASE_URL = "http://localhost:3000";

export function fetchMarkets() {
    return apiGet("/api/markets","");
}

export function fetchMarketBySymbol(symbol) {
    return apiGet(`/api/markets/${encodeURIComponent(symbol)}`);
}

async function apiGet(endpoint, symbol) {
    const response = await fetch(`${API_BASE_URL}${endpoint}/${symbol}`);

    if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }

        return await response.json();
    }