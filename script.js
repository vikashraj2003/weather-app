const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("result");

button.addEventListener("click", getWeather);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});

async function getWeather() {
  const city = input.value.trim();
  if (!city) {
    result.innerHTML = "Please enter a city name.";
    return;
  }

  result.innerHTML = "Loading...";

  try {
    // API call 1: convert city name into latitude/longitude
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results) {
      result.innerHTML = "City not found.";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // API call 2: get the weather for that location
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;

    result.innerHTML = `
      <h2>${name}, ${country}</h2>
      <div class="temp">${current.temperature_2m}°C</div>
      <p>Wind: ${current.wind_speed_10m} km/h</p>
      <p>Humidity: ${current.relative_humidity_2m}%</p>
    `;
  } catch (error) {
    result.innerHTML = "Something went wrong. Try again.";
  }
}
