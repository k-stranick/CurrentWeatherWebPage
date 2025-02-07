//remember ctrl + shift + l to select all the same words

// API Key and URL (Define Globally) 
const WORKER_URL = "https://long-bush-acb2.kyle-stranickschool.workers.dev/";

const searchBar = document.querySelector("#searchBar");
const searchButton = document.querySelector("#searchButton");
const weatherInfo = document.querySelector(".weather-info");
const searchContainer = document.querySelector("#searchContainer");


// Search Input Text Field Event Listener
searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }

});

// Search Submit Button Event Listener
searchButton.addEventListener("click", (e) => {
    handleSearch();
});

/**
 * Handles the search functionality by fetching and displaying weather information.
 * This will reset the search bar focus after the search is complete.
 */
async function handleSearch() {
    await fetchAndDisplayWeather();
    searchBar.focus();
}

/**
 * Fetches and displays weather information based on user input.
 * 
 * This function retrieves the value from the search bar input, checks if it is valid,
 * and then fetches the weather data from the API. If the input is empty, it alerts the user.
 * If the API request fails, it shows an error message. If the request is successful,
 * it displays the weather information.
 * 
 * @returns {Promise<void>}
 */
async function fetchAndDisplayWeather() {
    const locationInput = searchBar.value.trim();
    if (!locationInput) {
        alert("Please enter City or Zip Code to get Local Weather!");
        return;
    }

    try {
        const weatherData = await fetchCurrentWeatherData(locationInput);

        if (weatherData) {
            console.log("Weather Data:", weatherData); // Debugging

            displayWeather(weatherData);
            searchBar.value = "";
        }

    } catch (error) {
        console.error(`Error displaying weather data: ${error.message}\nStack Trace: ${error.stack}`);
        showErrorMessage("An error occurred while fetching the weather data. Please try again later.");
    }
}

/**
 * Fetches weather data from the Tomorrow.io API for a given location.
 * 
 * This function constructs the API URL using the provided location and API key,
 * makes a GET request to the API, checks the response status, parses the JSON response,
 * and returns the weather data. If the request fails, it displays an error message in the UI.
 * 
 * @param {string} location - The location (city or zip code) for which to fetch weather data.
 * @returns {Promise<Object|null>} - The weather data object if the request is successful, or null if it fails.
 */
async function fetchCurrentWeatherData(location) {
    const workerUrl = `${WORKER_URL}?location=${encodeURIComponent(location)}`;
    try {

        const response = await fetch(workerUrl);

        if (!response.ok) {
            throw new Error(`Request has failed with status ${response.status}`);
        }

        const weatherData = await response.json();
        console.log("Raw API response:", weatherData); // Debugging will print the JSON response in the console

        return weatherData;

    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}\nStack Trace: ${error.stack}`);
        showErrorMessage("An error occurred while fetching the weather data. Please try again later.");
        return null;
    }
}

/**
 * Displays weather information in the UI.
 * 
 * This function takes the weather data object, extracts relevant information,
 * and updates the HTML content of the weather container to display the weather details.
 * 
 * @param {Object} data - The weather data object containing weather information.
 */
function displayWeather(data) {
    const container = searchContainer;

    // Remove old weather-info if it exists
    removeOldElement();

    // Create a new weather-info card
    const weatherCard = createCard();

    //extracting data from the API response
    const weatherDetails = extractWeatherDetails(data);
    console.log("Extracted Weather Details:", weatherDetails); // Debugging

    //updating the HTML content of the weather container
    weatherCard.innerHTML = generateWeatherHTML(weatherDetails);
    console.log("Generated HTML:", weatherCard.innerHTML); // Debugging

    container.appendChild(weatherCard);
}

/**
 * Extracts weather details from the API response.
 * 
 * @param {Object} data - The weather data object containing weather information.
 * @returns {Object} - An object containing extracted weather details.
 */
function extractWeatherDetails(data) {
    const values = data?.data?.values || {};

    return {
        locationName: data?.location?.name ?? "N/A",
        currentTime: new Date(data?.data?.time).toLocaleString() ?? "N/A",
        temperature: values.temperature ?? "N/A",
        humidity: values.humidity ?? "N/A",
        pressure: values.pressureSurfaceLevel ?? "N/A"
    };
}

/**
 * Converts Unix time to a human-readable date and time.
 * @param {number} unixTime 
 * @returns {string} - The human-readable date and time.
 */
function convertUnixTimeToDateTime(unixTime) {
    return new Date(unixTime * 1000).toLocaleString();
}

// /**
//  * Generates HTML content for displaying weather information.
//  * 
//  * @param {Object} weatherDetails - An object containing weather details.
//  * @returns {string} - The HTML content for displaying weather information.
//  */
function generateWeatherHTML(weatherDetails) {
    const { locationName, currentTime, temperature, humidity, pressure } = weatherDetails;

    return `
    <div class="fade-in">
        <h1 class="weather-title text-dark">Current Weather</h1>
        
        <div class="text-center">
            <h2 class="location">
                <i class="bi bi-geo-alt-fill text-danger"></i> ${locationName}
            </h2>
            
            <p class="time text-muted">
                <i class="bi bi-clock text-primary"></i> ${currentTime}
            </p>

            <div class="row mt-3">
                <div class="col-4">
                    <div class="stat-box">
                        <i class="bi bi-thermometer-half text-warning"></i>
                        <p class="fw-bold">${temperature}°F</p>
                        <span class="text-muted">Temperature</span>
                    </div>
                </div>

                <div class="col-4">
                    <div class="stat-box">
                        <i class="bi bi-moisture text-info"></i>
                        <p class="fw-bold">${humidity}%</p>
                        <span class="text-muted">Humidity</span>
                    </div>
                </div>

                <div class="col-4">
                    <div class="stat-box">
                        <i class="bi bi-speedometer2 text-success"></i>
                        <p class="fw-bold">${pressure} hPa</p>
                        <span class="text-muted">Pressure</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Displays an error message in the UI.
 * 
 * This function takes an error message string, updates the HTML content of the weather container
 * to display the error message in red, and logs the error message to the console.
 * 
 * @param {string} message - The error message to display.
 */
function showErrorMessage(message) {
    // Remove old weather-info if it exists
    removeOldElement();

    // Create a new error card
    const errorCard = createCard();

    // Insert your error message
    errorCard.innerHTML = `
      <p style="color:red;">Error: ${message}</p>
    `;

    // Append to main container
    const container = searchContainer;
    container.appendChild(errorCard);

    console.error(message);
}

/**
 * This function creates a new .weather-info Bootstrap v5.3.3 card element.
 * @returns {HTMLDivElement} - A new .weather-info card element.
 */
function createCard() {
    // Create a brand-new .weather-info card
    const Card = document.createElement("div");
    Card.classList.add("card", "weather-info");
    Card.style.display = "block";

    return Card;
}

/**
 * This function removes the existing .weather-info Bootstrap v5.3.3 card element.
 */
function removeOldElement() {
    const oldWeatherCards = document.querySelectorAll(".weather-info");
    oldWeatherCards.forEach((card) => card.remove());
}