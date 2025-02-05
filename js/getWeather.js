// this listens for  an event on the searchButton ID and calls the display weather function if valid
document.querySelector('#searchButton').addEventListener('click', async function () {
    const locationInput = document.querySelector('#cityInput').value.trim();

    if (!locationInput) {
        alert('Please enter City or Zip Code');
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
    const tomorrowIoApiKey = 'hVoTEBLzRGVyrM3Z3z7iDALSJLqcZLU4'
    const tomorrowIoUrl = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(location)}}&apikey=${tomorrowIoApiKey}`

    try {
        // send request to the weather API
        const response = await fetch(tomorrowIoUrl);

        if (!response.ok) {
            throw new Error('Request has failed with status ${response.status}');
        }

        const weatherData = await response.json();
        console.log('Raw API response:', weatherData); // For debugging
      
        return weatherData;

    } catch (error) {
    // Show an error message in .weather-info container
    document.querySelector('.weather-info').style.display = 'block';
    document.querySelector('.weather-info').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    console.error(error);
    return null;
    }
}

function displayWeather(data) {
    // make the weather infor secion visible
    const weatherContainer = document.querySelector('.weather-info');
    weatherContainer.style.display = 'block';

    const values = data?.data?.values || {};
  const temperature = values.temperature ?? 'N/A';
  const humidity = values.humidity ?? 'N/A';
  const pressure = values.pressureSeaLevel ?? 'N/A';
  
  // Populate the container with desired info
  weatherContainer.innerHTML = `
    <h3>Weather Information</h3>
    <p><strong>Temperature:</strong> ${temperature} °C</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Pressure:</strong> ${pressure} hPa</p>
  `;
}



/*
const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'accept-encoding': 'deflate, gzip, br'}
  };
  
  fetch('https://api.tomorrow.io/v4/weather/realtime?location=toronto&apikey=hVoTEBLzRGVyrM3Z3z7iDALSJLqcZLU4', options)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));
    */