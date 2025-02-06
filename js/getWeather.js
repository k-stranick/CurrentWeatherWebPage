//remember ctrl + shift + l to select all the same words

// API Key and URL (Define Globally)
const TOMORROW_IO_API_KEY = "hVoTEBLzRGVyrM3Z3z7iDALSJLqcZLU4";
const TOMORROW_IO_REALTIME_URL = "https://api.tomorrow.io/v4/weather/realtime";

const searchBar = document.querySelector("#searchBar");
const searchButton = document.querySelector("#searchButton");
const weatherInfo = document.querySelector(".weather-info");
const searchContainer = document.querySelector("#searchContainer");


// Search Input Event Listener
searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }

});

// Search Button Event Listener
searchButton.addEventListener("click", (e) => {
    handleSearch();
});


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
        const errorMessage = `Error displaying weather data: ${error.message}\nStack Trace: ${error.stack}`;
        console.error(errorMessage);
        showErrorMessage(errorMessage);
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
    // try {

    const response = await fetch(tomorrowIoUrl);

    if (!response.ok) {
        throw new Error(`Request has failed with status ${response.status}`);
    }

    const weatherData = await response.json();
    console.log("Raw API response:", weatherData); // Debugging will print the JSON response in the console

    return weatherData;

    // } catch (error) {
    //     weatherInfo.style.display = "block";
    //     weatherInfo.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    //     console.error(error);

    //     return null;
    // }
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
    const values = data?.data?.values || {};
    const locationName = data?.location?.name ?? "N/A";
    const currentTime = data?.data?.time ?? "N/A"; // need to make current time 
    const temperature = values.temperature ?? "N/A";
    const humidity = values.humidity ?? "N/A";
    const pressure = values.pressureSurfaceLevel ?? "N/A";

    //updating the HTML content of the weather container
    weatherCard.innerHTML = `
    <h1>Current Weather</h1>
    <p><strong>Location:</strong> ${locationName}</p>
    <p><strong>Time:</strong>  ${currentTime}</p>
    <p><strong>Temperature:</strong> ${temperature} °F</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Pressure:</strong> ${pressure} hPa</p>
  `;

    container.appendChild(weatherCard);
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