const apiKey = "9b128ce271b8e724c9cc8522805fa085";
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const historyEl = document.getElementById("history");
const todayEl = document.getElementById("today");
const forecastEl = document.getElementById("forecast");

// Function to fetch weather data
async function fetchWeather(city) {
   const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
   const response = await fetch(apiUrl);
   if (response.ok) {
      const data = await response.json();
      showCurrentWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
      saveSearchHistory(city);
      updateSearchHistory();
   } else {
      alert("Failed to retrieve weather data. Please check the city name and try again.");
   }
}

// Function to fetch 5-day forecast
async function fetchForecast(lat, lon) {
   const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
   const response = await fetch(apiUrl);
   if (response.ok) {
      const data = await response.json();
      showForecast(data);
   } else {
      alert("Failed to retrieve forecast data.");
   }
}

// Display current weather
function showCurrentWeather(data) {
   const { name, main, weather, wind } = data;
   const date = new Date().toLocaleDateString();
   const weatherHTML = `
        <h2>${name} (${date})</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>Weather: ${weather[0].main}</p>
    `;
   todayEl.innerHTML = weatherHTML;
}

// Display 5-day forecast
function showForecast(data) {
   let forecastHTML = '<h2>5-Day Forecast:</h2><div class="forecast-container">';
   data.list.forEach((item, index) => {
      if (index % 8 === 0) {
         const date = new Date(item.dt_txt).toLocaleDateString();
         forecastHTML += `
                <div class="forecast-item">
                    <h3>${date}</h3>
                    <p>Temp: ${item.main.temp} °C</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                </div>
            `;
      }
   });
   forecastHTML += "</div>";
   forecastEl.innerHTML = forecastHTML;
}

// Save search history to localStorage
function saveSearchHistory(city) {
   let searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
   if (!searches.includes(city)) {
      searches.push(city);
      localStorage.setItem("searchHistory", JSON.stringify(searches));
   }
}

// Update search history in the UI
function updateSearchHistory() {
   let searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
   let historyHTML = "";
   searches.forEach((city) => {
      historyHTML += `<button class="list-group-item list-group-item-action">${city}</button>`;
   });
   historyEl.innerHTML = historyHTML;
}

// Event listener for form submission
searchForm.addEventListener("submit", (e) => {
   e.preventDefault();
   const city = searchInput.value.trim();
   if (city) {
      fetchWeather(city);
      searchInput.value = ""; // Clear input after search
   }
});

// Event listener for search history click
historyEl.addEventListener("click", (e) => {
   if (e.target.matches(".list-group-item")) {
      const city = e.target.textContent;
      fetchWeather(city);
   }
});

// Initialize app by updating search history on load
updateSearchHistory();