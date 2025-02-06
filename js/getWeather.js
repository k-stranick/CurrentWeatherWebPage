//remember ctrl + shift + l to select all the same words

// API Key and URL (Define Globally)
const TOMORROW_IO_API_KEY = "hVoTEBLzRGVyrM3Z3z7iDALSJLqcZLU4";
const TOMORROW_IO_REALTIME_URL = "https://api.tomorrow.io/v4/weather/realtime";

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
 * Will reset the search bar focus after the search is complete.
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
        alert("Please enter City or Zip Code to get Weather update!");
        return;
    }

    try {
        const weatherData = await fetchCurrentWeatherData(locationInput);

        if (weatherData) {
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
    const tomorrowIoUrl = `${TOMORROW_IO_REALTIME_URL}?location=${encodeURIComponent(location)}&units=imperial&apikey=${TOMORROW_IO_API_KEY}`;
    try {

        const response = await fetch(tomorrowIoUrl);

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

    //updating the HTML content of the weather container
    weatherCard.innerHTML = generateWeatherHTML(weatherDetails);

    container.appendChild(weatherCard);
}

// pulled from online I will need to test this function
// function convertUnixTimeToDateTime(unixTime) {
//     return new Date(unixTime * 1000).toLocaleString();
// }

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
        currentTime: data?.data?.time ?? "N/A", // need to make current time 
        temperature: values.temperature ?? "N/A",
        humidity: values.humidity ?? "N/A",
        pressure: values.pressureSurfaceLevel ?? "N/A"
    };
}

/**
 * Generates HTML content for displaying weather information.
 * 
 * @param {Object} weatherDetails - An object containing weather details.
 * @returns {string} - The HTML content for displaying weather information.
 */
function generateWeatherHTML(location, currentTime, temperature, humidity, pressure) {
    return `
      <h1 class="weather-title">Current Weather</h1>
      <div class="weather-details">
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Time:</strong> ${currentTime}</p>
        <p><strong>Temperature:</strong> <span class="temp">${temperature} °F</span></p>
        <p><strong>Humidity:</strong> <span class="humidity">${humidity}%</span></p>
        <p><strong>Pressure:</strong> <span class="pressure">${pressure} hPa</span></p>
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