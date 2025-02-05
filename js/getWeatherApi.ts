// const tomorrowIoApiKey = 'hVoTEBLzRGVyrM3Z3z7iDALSJLqcZLU4'


async function getWeather() {
    const city = document.getElementById("cityInput").value.trim(); // Trim to remove spaces

    // 🚨 Validate user input
    if (!city) {
        alert('City cannot be empty');
        console.error('City cannot be empty');
        return;
    }

    const apiKey = "hVoTEBLzRGVyrM3Z3z7iDALSJLqcZLU4"; // Replace with your Tomorrow.io API key

    // 🌍 Get latitude & longitude for the city using OpenWeatherMap or another geocoding API
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    try {
        // 🌍 First, get lat/lon for the city
        const geocodeResponse = await fetch(geocodeUrl);
        if (!geocodeResponse.ok) throw new Error(`Geocoding failed: ${geocodeResponse.status}`);

        const geocodeData = await geocodeResponse.json();
        if (!geocodeData.results || geocodeData.results.length === 0) {
            throw new Error("City not found. Try another location.");
        }

        const { latitude, longitude } = geocodeData.results[0];

        // 🌤️ Fetch weather data from Tomorrow.io
        const weatherUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&apikey=${apiKey}`;

        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

        const weatherData = await response.json();
        console.log(weatherData); // Debugging: Check API response

        // Extract weather details from tomorrow.io JSON response calling index 0 calls weather for THAT 
        const currentTemp = weatherData.timelines.daily[0].values.temperatureAvg;
        const humidity = weatherData.timelines.daily[0].values.humidityAvg;
        const windSpeed = weatherData.timelines.daily[0].values.windSpeedAvg;

        // 📌 Display weather details
        document.querySelector("weatherResults").innerHTML = `
            <h2>Weather for ${city}</h2>
            <p>🌡️ Temperature: ${currentTemp}°C</p>
            <p>💧 Humidity: ${humidity}%</p>
            <p>💨 Wind Speed: ${windSpeed} m/s</p>
        `;
    } catch (error) {
        document.getElementById("weatherResults").innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        console.error(error);
    }
}
