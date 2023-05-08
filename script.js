let loc = document.getElementById("location");
let tempicon = document.getElementById("temp-icon");
let tempvalue = document.getElementById("temp-value");
let climate = document.getElementById("climate");
let iconfile;
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  getWeather(searchInput.value);
  searchInput.value = "";
});

const getWeather = async (city) => {
  try {
    const response = await fetch(`https://us-central1-weather-app-likhitha.cloudfunctions.net/helloWorld?city=${city}`, {
      mode: "cors",
    });

    const weatherData = await response.json();
    console.log(weatherData);
    loc.textContent = weatherData.city;
    climate.textContent = weatherData.climate;
    tempvalue.textContent = weatherData.tempvalue;
    tempicon.src = weatherData.iconfile;
  } catch (error) {
    console.log(error);
    alert("city not found");
  }
};

window.addEventListener("load", () => {
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const response = await fetch(
        `https://us-central1-weather-app-likhitha.cloudfunctions.net/helloWorld?lat=${lat}&lon=${long}`,
        { mode: "cors" }
      );

      const weatherData = await response.json(); 
      console.log(weatherData);
      loc.textContent = weatherData.city;
      climate.textContent = weatherData.climate;
      tempvalue.textContent = weatherData.tempvalue;
      tempicon.src = weatherData.iconfile;
    });
  }
});
