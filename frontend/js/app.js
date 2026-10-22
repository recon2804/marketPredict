//DOM id for card
const marketContent = document.querySelector("#market-content");

//Currency and data type formater
    const currencyFormatter = new Intl.NumberFormat("cs-CZ", 
        {style: "currency", currency: "USD"});

    const percentFormatter = new Intl.NumberFormat("cs-CZ", 
        {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero"})

let selectedSymbol = "AAPL"
let marketData = [];

//Card rendering
 function renderMarketCards(data) {
    marketContent.innerHTML = "";

    const marketCount = document.querySelector("#market-count");
    marketCount.textContent = data.length;

    if (data.length === 0) {
        const resultMessage = `
            <div class="market-empty">
                <h3>Žádné výsledky</h3>
                <p>Zkus jiný název nebo ticker.</p>
            </div>
        `;

        marketContent.insertAdjacentHTML("beforeend", resultMessage);
        return;
    }

    data.forEach( (oneStock)=> {
        const changeClass = oneStock.change >= 0 ? "market-card__change--positive" : "market-card__change--negative";
        const selectedClass = oneStock.symbol === selectedSymbol ? "is-selected": "";
        
        const card = 
        `<article class="market-card ${selectedClass}" data-symbol="${oneStock.symbol}">
                <h3>${oneStock.symbol}</h3>
                <p>${oneStock.name}</p>
                <p>${oneStock.type}</p>
                <p>${currencyFormatter.format(oneStock.price)}</p>
                <p class=${changeClass}>${percentFormatter.format(oneStock.change)} <span>%</span></p>
        </article>`;  
            
            marketContent.insertAdjacentHTML("beforeend", card);
    });
}

//Filter buttons
const filterButtons = document.querySelectorAll(".market-filter");

filterButtons.forEach((oneButton) => {
    oneButton.addEventListener("click", () => {
        filterButtons.forEach((button) => {
            button.classList.remove("is-active");
        });

        oneButton.classList.add("is-active");

        updateMarketView();
    });
});

//Searching function
const searchInput = document.querySelector("#market-search-input");

searchInput.addEventListener("input", () => {
    updateMarketView()
});

//Merging search + filter
function updateMarketView() {

    //active filter
    const activeFilter = document.querySelector(".market-filter.is-active");
    const selectedFilter = activeFilter.dataset.filter;

    //searching prompt
    const searchingPrompt = searchInput.value;
    const cleanedSearchingPrompt = searchingPrompt.trim().toLowerCase();

   //Filtering by both conditions and rerendering cards
    const filteredItems = marketData.filter((oneStock) => {
        const matchesType = selectedFilter === "all" || oneStock.type === selectedFilter;
        const matchesSearch = oneStock.symbol.toLowerCase().includes(cleanedSearchingPrompt)|| oneStock.name.toLowerCase().includes(cleanedSearchingPrompt);
            return matchesType && matchesSearch;
    });

    renderMarketCards(filteredItems);
}

updateMarketView();

//Graph rendering
const chartContainer = document.querySelector("#price-chart");

const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 400,

    layout: {
        background: {
            color: "#0f172a"
        },
        textColor: "#94a3b8"
    },

    grid: {
        vertLines: {
            color: "#1e293b"
        },
        horzLines: {
            color: "#1e293b"
        }
    }
});

const lineSeries = chart.addLineSeries({
    color: "#38bdf8",
    lineWidth: 2
});

const observer = new ResizeObserver(() => {
    chart.applyOptions({
        width: chartContainer.clientWidth
    });
});

observer.observe(chartContainer);

//Unique graph for selected instruments

marketContent.addEventListener("click", (event) => {

    // 1. Najdeme kliknutou kartu
    const selectedCard = event.target.closest(".market-card");

    if (!selectedCard) {
        return;
    }

    // 2. Získáme symbol kliknuté akcie
    const clickedSymbol = selectedCard.dataset.symbol;

    // 3. Najdeme historická data
    const selectedHistory = marketHistory[clickedSymbol];

    if (!selectedHistory) {
        return;
    }

    // 4. Aktualizujeme stav aplikace
    selectedSymbol = clickedSymbol;

    // 5. Odebereme zvýraznění ze všech karet
    document.querySelectorAll(".market-card").forEach((card) => {
        card.classList.remove("is-selected");
    });

    // 6. Zvýrazníme kliknutou kartu
    selectedCard.classList.add("is-selected");

    // 7. Aktualizujeme graf
    const activePeriodButton = document.querySelector(".chart-period.is-active");
    const activePeriod = activePeriodButton?.dataset.period ?? "ALL";

updateChartPeriod(activePeriod);

    // 8. Najdeme informace o instrumentu
    const selectedStock = marketData.find((oneStock) => {
        return oneStock.symbol === selectedSymbol;
    });

    // 9. Aktualizujeme nadpis grafu
    const chartTitle = document.querySelector("#chart-title");

    if (selectedStock && chartTitle) {
        chartTitle.textContent =`${selectedStock.name} (${selectedStock.symbol}) – Price History`;
    }
});

//Event listener for chart period buttons
const chartPeriodButtons = document.querySelectorAll(".chart-period");

chartPeriodButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".chart-period").forEach((btn) => {
            btn.classList.remove("is-active");
        });

        button.classList.add("is-active");

        const period = button.dataset.period;
        updateChartPeriod(period);
    });
});

//Function to get start date based on selected period

function getStartDate(period) {
    const periodMonths = {
        "1M": 1,
        "3M": 3,
        "6M": 6,
        "1Y": 12
    };

    const months = periodMonths[period];

    if (months === undefined) {
        return null;
    }

    const today = new Date();
    const startDate = new Date(today);
    const originalDay = startDate.getUTCDate();

    startDate.setUTCDate(1);
    startDate.setUTCMonth(startDate.getUTCMonth() - months);

    const targetMonth = startDate.getUTCMonth();
    startDate.setUTCDate(originalDay);

    if (startDate.getUTCMonth() !== targetMonth) {
        startDate.setUTCDate(0);
    }

    startDate.setUTCHours(0, 0, 0, 0);
    return startDate;
}

//Function to filter history by date
function filterHistoryByDate(history, startDate) {
    return history.filter((oneRecord) => {
        const recordDate = new Date(oneRecord.time);
        return recordDate >= startDate;
    });
}

//Function to update chart period based on selected button
function updateChartPeriod(period) {
    const selectedHistory = marketHistory[selectedSymbol];

    if (!selectedHistory) {
        return;
    }

    let filteredHistory;

    if (period === "ALL") {
        filteredHistory = selectedHistory;
    } else {
        const startDate = getStartDate(period);
        filteredHistory = filterHistoryByDate(selectedHistory, startDate);
    }

    lineSeries.setData(filteredHistory);
    chart.timeScale().fitContent();;
}

const initialPeriodButton = document.querySelector(".chart-period.is-active");

if (initialPeriodButton) {
    updateChartPeriod(initialPeriodButton.dataset.period);
}

//Frontend pro načtení dat Loading, Success, Error
function showMarketMessage(message, showRetry = false) {
    const retryButton = showRetry
    ? `<button id="retry-markets">Zkusit znovu</button>`
    : "";

    marketContent.innerHTML = `
        <div class="market-empty">
            <p>${message}</p>
            ${retryButton}
        </div>
    `;
}

marketContent.addEventListener("click", (event)=>{
        if(event.target.closest("#retry-markets")){
            loadMarkets()
        }
    })

//Načítání backendu
async function loadMarkets() {
    try {
        showMarketMessage("Načítám instrumenty...");
        const response = await fetch("http://localhost:3000/api/markets");

        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }

        const data = await response.json();

        marketData = data;
       
       updateMarketView()

    } catch (error) {
         marketData = [];
        showMarketMessage("Nepodařilo se načíst data. Zkontroluj připojení k serveru.", true); 
        console.error("Nepodařilo se načíst instrumenty:", error);
    }
}

loadMarkets();