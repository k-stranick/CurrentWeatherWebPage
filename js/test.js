// API Key and URL (Define Globally)
const tomorrowIoApiKey = "hVoTEBLzRGVyrM3Z3z7iDALSJLqcZLU4";
const tomorrowIoRealTimeWeatherUrl = "https://api.tomorrow.io/v4/weather/realtime";

// Search Input Event Listener
document.querySelector("#searchBar").addEventListener("keydown", function (e) {
    if (e.key === "Enter") fetchAndDisplayWeather();
});

// Search Button Event Listener
document.querySelector("#searchButton").addEventListener("click", fetchAndDisplayWeather);


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
    const locationInput = document.querySelector("#searchBar").value.trim();

    if (!locationInput) {
        alert("Please enter City or Zip Code to get Weather update!");
        return;
    }

    try {
        const weatherData = await fetchCurrentWeatherData(locationInput);
        console.log("Raw API response:", weatherData); // Debugging

        if (weatherData) {
            displayWeather(weatherData);
        }
    } catch (error) {
        showErrorMessage(error.message);
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
    const tomorrowIoUrl = `${tomorrowIoRealTimeWeatherUrl}?location=${encodeURIComponent(location)}&units=imperial&apikey=${tomorrowIoApiKey}`;

    try {
        const response = await fetch(tomorrowIoUrl);

        if (!response.ok) {
            throw new Error(`Request has failed with status ${response.status}`);
        }

        const weatherData = await response.json();
        console.log("Raw API response:", weatherData); // Debugging

        return weatherData;

    } catch (error) {
        document.querySelector(".weather-info").style.display = "block";
        document.querySelector(".weather-info").innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        console.error(error);
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
    const weatherContainer = document.querySelector(".weather-info");
    weatherContainer.style.display = "block";

    const values = data?.data?.values || {};
    const locationName = data?.location?.name ?? "N/A";
    const currentTime = data?.data?.time ?? "N/A"; // need to make current time 
    const temperature = values.temperature ?? "N/A";
    const humidity = values.humidity ?? "N/A";
    const pressure = values.pressureSurfaceLevel ?? "N/A";

    weatherContainer.innerHTML = `
    <h1>Current Weather</h1>
    <p><strong>Location:</strong> ${locationName}</p>
    <p><strong>Time:</strong>  ${currentTime}</p>
    <p><strong>Temperature:</strong> ${temperature} °F</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Pressure:</strong> ${pressure} hPa</p>
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
    const weatherContainer = document.querySelector(".weather-info");
    weatherContainer.style.display = "block";
    weatherContainer.innerHTML = `<p style="color:red;">Error: ${message}</p>`;
    console.error(message);
}

