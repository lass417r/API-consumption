"use strict";

import { weatherAPIKey, mapAPIKey, eventsAPIKey } from "./info.js";

const cityBtn = document.querySelector("#btnTownInfo");
cityBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const townName = document.querySelector("#txtTown").value.trim();
  if (townName === "") {
    alert("You have to write a town name");
    return;
  }

  const URL =
    `https://api.openweathermap.org/data/2.5/weather?q=` +
    townName +
    `&units=metric&appid=` +
    weatherAPIKey;

  fetch(URL)
    .then((response) => response.json())
    .then((data) => showWeather(data))
    .catch((error) => console.log(error));
  // Load weather information
});

function showWeather(data) {
  console.log(data);
  console.log("showWeather");
  let html = "";

  document.querySelector("#weatherInfo").style.visibility = "visible";

  var townName = document.getElementById("townName");
  var mainWeather = document.getElementById("mainWeather");
  var temperature = document.getElementById("temperature");
  var feelsLike = document.getElementById("feelsLike");
  var humidity = document.getElementById("humidity");
  var wind = document.getElementById("wind");

  townName.innerHTML = data.name + ", " + data.sys.country;
  mainWeather.innerHTML =
    "The weather in " + data.name + " is " + data.weather[0].main;
  temperature.innerHTML = data.main.temp;
  feelsLike.innerHTML = data.main.feels_like;
  humidity.innerHTML = data.main.humidity;
  wind.innerHTML = data.wind.speed;

  var longitude = data.coord.lon;
  var latitude = data.coord.lat;
  console.log("showMap weaher");
  showMap(longitude, latitude);
  showEvents(data.name);
}

const showMap = (longitude, latitude) => {
  console.log(longitude, latitude);
  console.log("showMap");
  const weatherInfo = document.querySelector("#weatherInfo");
  const weather = document.querySelector("#weather");
  const map = document.querySelector("#map");
  const userName = "mapbox";
  let mapWidth = "";

  if (window.getComputedStyle(map).display === "block") {
    mapWidth = weatherInfo.offsetWidth.toFixed(0);
  } else {
    const padding = 32;
    mapWidth = (
      weatherInfo.offsetWidth -
      weather.offsetWidth -
      padding
    ).toFixed(0);
  }

  map.style.width = mapWidth + "px";

  const URL =
    "https://api.mapbox.com/styles/v1/" +
    userName +
    "/streets-v11/static/" +
    longitude +
    "," +
    latitude +
    ",12,0,60/" +
    mapWidth +
    "x200?access_token=" +
    mapAPIKey;

  console.log("URL: ", URL);

  map.src = URL;
};

function showEvents(townName) {
  console.log(townName);
  console.log("showEvents");
  const eventList = document.getElementById("eventList");
  const eventInfo = document.getElementById("eventInfo");

  const URL =
    "https://app.ticketmaster.com/discovery/v2/events?apikey=" +
    eventsAPIKey +
    "&locale=*&city=" +
    townName;

  eventList.innerHTML = "";

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      if (data.page.totalElements === 0) {
        eventList.innerHTML =
          "There are no events scheduled for the selected town";
        eventInfo.style.display = "block";
        return;
      }
      document.querySelector("#eventInfo").style.visibility = "visible";
      data._embedded.events.forEach(function (item) {
        const venues = item._embedded.venues;
        let eventText = item.name + "<br>";
        eventText +=
          item.dates.start.localDate + " " + item.dates.start.localTime;
        for (const venue of venues) {
          eventText += ", " + venue.name;
        }

        const event = document.createElement("p");
        event.innerHTML = eventText;
        event.classList.add("event");

        const statusCode = item.dates.status.code;
        if (statusCode !== "onsale") {
          const status = document.createElement("span");
          status.textContent = " (" + statusCode + ")";
          status.classList.add("alert");
          event.appendChild(status);
        }

        eventList.appendChild(event);
      });

      // Apply oddEvent class to odd-numbered events for a light blue background
      const eventElements = eventList.getElementsByTagName("p");
      for (let i = 0; i < eventElements.length; i++) {
        if (i % 2 !== 0) {
          eventElements[i].classList.add("oddEvent");
        }
      }

      eventInfo.style.display = "block";
    })
    .catch(function (error) {
      console.error(error);
      eventInfo.style.display = "none";
    });
}
