const weather = document.querySelector(".weather")
const selectState = document.getElementById("state");
const selectCity = document.getElementById("city");
const getWeatherBtn = document.querySelector(".button");
const cityId = document.querySelector(".city-Id");
const tempId = document.querySelector(".temp-Id")
const skyConditions = document.querySelector(".sky-conditions");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind-speed");
const addHomeCity = document.getElementById("addHomeCity")
const fieldSet = document.querySelector("fieldset");
const resetForm = document.getElementById("resetForm")
const favCities = [];
let cityLat;
let cityLon;
let cityParam;
let stateParam;
addHomeCity.addEventListener("click", addFavorite);
getWeatherBtn.addEventListener("click", weatherFetch);
document.addEventListener(`readystatechange`, getFavorites);

const stateArr = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];
stateArr.forEach((ele) => {
  const option = document.createElement("option");
  option.textContent = ele;
  selectState.appendChild(option);
});

function weatherFetch(event) {
  event.preventDefault();
   cityParam = selectCity.value;
   stateParam = state.value;
  const fetchLatLonCity = fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityParam},${stateParam},&limit=1&appid=a447104b72bd71416b8640425419b62b`
  );
  
  fetchLatLonCity
  .then((res) => res.json())
    .then((data) => {
         cityLat = data[0].lat;
         cityLon = data[0].lon;
        const fetchWeather = fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=a447104b72bd71416b8640425419b62b`
        )
        fetchWeather
        .then((res) => res.json())
        .then((data) => {
            updateWeather(data);
        })
        .catch((err) => {
            console.log(err);
        });
        
    })
    .catch((err) => {
        console.log(err);
    });

    resetForm.reset();
}


function updateWeather(data) {
    cityId.textContent = `City: ${data.name}`;
    tempId.textContent = `Temperature: ${Math.trunc(data.main.temp)}F`;
    skyConditions.textContent = `Conditions: ${data.weather[0].main}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed}MPH`;
    addHomeCity.style.display = "block";
}

function addFavorite() {
let newFav = {
  city: cityParam,
  state: stateParam,
  latitude: cityLat,
  longitude: cityLon
}
favCities.push(newFav);
storeFavorites();

fieldSet.innerHTML = "";
const legend = document.createElement(`legend`)
legend.textContent = "Favorite Locations";
fieldSet.appendChild(legend);

favCities.forEach((ele) => {
    buildFavList(ele);
})
}

function updateFavWeather(event) {
  const fetchWeather = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${event.target.getAttribute("lat")}&lon=${event.target.getAttribute("lon")}&units=imperial&appid=a447104b72bd71416b8640425419b62b`
  )
  fetchWeather
  .then((res) => res.json())
  .then((data) => {
      updateWeather(data);
  })
  .catch((err) => {
      console.log(err);
  });

}

function buildFavList (ele) {
let newDiv = document.createElement(`div`)
    newDiv.class = "radio-div"
    let newInput = document.createElement(`input`)
    let newLabel = document.createElement(`label`);
    newInput.type = "radio";
    newInput.id = ele.city;
    newInput.name = "favorites";
    newInput.value = ele.city;
    newInput.setAttribute("lat", ele.latitude) 
    newInput.setAttribute("lon", ele.longitude) 
    newLabel.for = ele.city;
    newLabel.textContent = `${ele.city}, ${ele.state}`;
    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);
    fieldSet.appendChild(newDiv);
    newInput.addEventListener("change", updateFavWeather);
}


function storeFavorites() {
  window.localStorage.removeItem(`favorites`);
  let jsonObj = JSON.stringify(favCities);
  localStorage.setItem(`favorites`, jsonObj);
}

function getFavorites() {
  let jsonObj = window.localStorage.getItem(`favorites`);
  let parse = JSON.parse(jsonObj);
    parse.forEach((ele) => {
      buildFavList(ele);
  })

}
