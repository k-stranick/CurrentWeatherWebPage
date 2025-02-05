// this listens for  an event on the searchButton ID and calls the display weather function if valid
document.querySelector("#searchButton").addEventListener("click", async function () {
    const locationInput = document.querySelector("#cityInput").value.trim();

    if (!locationInput) {
        alert("Please enter City or Zip Code To get Weather update");
        return;
    }

    // fetch the weather data to display it
    const data = await getWeather(locationInput);

    if (data) {
        displayWeather(data);
    }
});

//function to fetch the weather data from the API
async function getWeather(location) {
    const tomorrowIoApiKey = "hVoTEBLzRGVyrM3Z3z7iDALSJLqcZLU4";
    const tomorrowIoUrl = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(location)}}&units=imperial&apikey=${tomorrowIoApiKey}`;

    try {
        // send request to the weather API
        const response = await fetch(tomorrowIoUrl);

        if (!response.ok) {
            throw new Error("Request has failed with status ${response.status}");
        }

        const weatherData = await response.json();
        console.log("Raw API response:", weatherData); // For debugging

        return weatherData;
    } catch (error) {
        // Show an error message in .weather-info container
        document.querySelector(".weather-info").style.display = "block";
        document.querySelector(".weather-info").innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        console.error(error);
        return null;
    }
}

function displayWeather(data) {
    // make the weather info section visible
    const weatherContainer = document.querySelector(".weather-info");
    weatherContainer.style.display = "block";

    const values = data?.data?.values || {};
    const locationName = data?.location?.name ?? "N/A";
    const currentTime = data?.data?.time ?? "N/A";
    const temperature = values.temperature ?? "N/A";
    const humidity = values.humidity ?? "N/A";
    const pressure = values.pressureSurfaceLevel ?? "N/A";

    // Populate the container with desired info
    weatherContainer.innerHTML = `
    <h3>Weather Information</h3>
    <p><strong>Location:</strong> ${locationName}</p>
    <p><strong>Time:</strong>  ${currentTime}</p>
    <p><strong>Temperature:</strong> ${temperature} °F</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Pressure:</strong> ${pressure} hPa</p>
  `;
}

function fetchWeatherDataCurrent(location) {
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'accept-encoding': 'deflate, gzip, br' }
    }

    const tomorrowIo = (`https://api.tomorrow.io/v4/weather/realtime?location=${location}`, options)
    fetch(tomorrowIo)
        .then(res => res.json()) // parse the JSON response
        .then(tomorrowIOWeatherData => {
            //Extract the weather details from the JSON response
            const temperature = tomorrowIOWeatherData.data.temperature;
            const name = tomorrowIOWeatherData.data.location.name;


        })

        .catch(err => console.error(err));
}

