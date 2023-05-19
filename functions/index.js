/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const randomstring = require("randomstring");
const axios = require("axios");

function middleware(request) {
  const reqIp = request.ip;
  const reqId = `REQ_${randomstring.generate(7)}`;
  console.log(`Request: ${reqId} | ${reqIp}`);
  request.reqId = reqId;
  return request;
}

exports.weather = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");
  functions.logger.info("Hello logs!", {structuredData: true});
  const city = request.query.city;
  request = middleware(request);
  try {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9c25d71309f799febed483efc24e0b5a`;
    if (!city) {
      const lat = request.query.lat;
      const lon = request.query.lon;

      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9c25d71309f799febed483efc24e0b5a`;
    }
    const res = await axios.get(url);

    const weatherData = await res.data;

    let tempicon;
    const id = weatherData.weather[0].id;
    if (id >= 200 && id < 300) {
      tempicon = "thunderstorm.png";
    } else if (id >= 300 && id < 400) {
      tempicon = "clouds.png";
    } else if (id >= 500 && id < 600) {
      tempicon = "rains.png";
    } else if (id >= 600 && id < 700) {
      tempicon = "snow.png";
    } else if (id >= 700 && id < 800) {
      tempicon = "clouds.png";
    } else if (id >= 800) {
      tempicon = "clouds.png";
    }
    const data = {
      iconfile: `https://raw.githubusercontent.com/likhithabandaru2003/weather-app/main/images/${tempicon}`,
      tempvalue: Math.round(weatherData.main.feels_like - 273),
      city: weatherData.name,
      id: weatherData.weather[0].id,
      climate: weatherData.weather[0].description,
    };
    response.send(data);
  } catch (error) {
    console.log(error.message);
    response.send(error.message);
  }
});
