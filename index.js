/***            OPTIONS MANAGEMENT              ***/

function optionCityName() {
    document.getElementById("app-header").style.setProperty("display","none");
    document.getElementById("options-list").style.setProperty("display","none");
    document.getElementById("phase2-list").style.setProperty("display","flex");
    document.getElementById("enter-city-name").style.setProperty("display","block");
    document.getElementById("enter-coords").style.setProperty("display","none");
}

function optionCoordinates() {
    document.getElementById("app-header").style.setProperty("display","none");
    document.getElementById("options-list").style.setProperty("display","none");
    document.getElementById("phase2-list").style.setProperty("display","flex");
    document.getElementById("enter-city-name").style.setProperty("display","none");
    document.getElementById("enter-coords").style.setProperty("display","block");
}

function resetResult() {
    document.getElementById("location").innerHTML = "loading...";
    document.getElementById("condition").innerHTML = "<b>⛅️ Condition:</b> loading...";
    document.getElementById("description").innerHTML = "<b>📄 Description:</b> loading...";
    document.getElementById("humidity").innerHTML = "<b>💧 Humidity:</b> loading...";
    document.getElementById("pressure").innerHTML = "<b>📊 Pressure:</b> loading...";

    document.getElementById("wind-speed").innerHTML = "<b>🏎️ Wind Speed:</b> loading...";
    document.getElementById("wind-direction").innerHTML = "<b>🧭 Wind Direction:</b> loading...";
    document.getElementById("special-note").innerHTML = "<b>Special note:</b> loading...";


    document.getElementById("temp").innerHTML = "<b>🌡️ Temp:</b> loading...";
    document.getElementById("min-temp").innerHTML = "<b>📉 Min:</b> loading...";
    document.getElementById("max-temp").innerHTML = "<b>📈 Max:</b> loading...";
    document.getElementById("real-feel").innerHTML = "<b>😶‍🌫️ Feels like:</b> loading...";

    document.getElementById("latest-response").innerHTML = "<b>Latest Response:</b> loading...";
}

function restart() {
    document.getElementById("app-header").style.setProperty("display","block");
    document.getElementById("options-list").style.setProperty("display","flex");
    document.getElementById("result-div").style.setProperty("display","none");
    document.getElementById("restart").style.setProperty("display","none");

    resetResult();
}

/***    API-RELATED FUNCTIONS AND CONSTANTS     ***/

const API_KEY = "2b2c5484ef443da5b2de3ce632278195";
const celcius = "&#8451;";

function getCityName() {
    let cityName = document.getElementById("city-name").value;
    weatherByCityName(cityName);
}

function getLonLat() {
    let lon = document.getElementById("longitude").value;
    let lat = document.getElementById("latitude").value;
    weatherByCoordinates(lat,lon);
}

function getGeolocation() {
    document.getElementById("app-header").style.setProperty("display","none");
    document.getElementById("options-list").style.setProperty("display","none");
    document.getElementById("result-div").style.setProperty("display","block");
    document.getElementById("restart").style.setProperty("display","block");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoordinates);
    }
    else {
        alert("Something is wrong. Check your browser settings");
    }
}

function getCoordinates(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    weatherByCoordinates(lat,lon);
}

function weatherByCoordinates(lat, lon) {
    document.getElementById("phase2-list").style.setProperty("display","none");
    document.getElementById("result-div").style.setProperty("display","block");
    document.getElementById("restart").style.setProperty("display","block");
    let url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric";
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        generateHTML(data);
    });
}

function weatherByCityName(cityName) {
    document.getElementById("phase2-list").style.setProperty("display","none");
    document.getElementById("result-div").style.setProperty("display","block");
    document.getElementById("restart").style.setProperty("display","block");
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API_KEY + "&units=metric";
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        generateHTML(data);
    });
}

function convert(deg) {
    deg = (deg + 360) % 360;
    if (deg == 0)
        return "North";
    if (deg < 90)
        return "North-East";
    if (deg == 90)
        return "East";
    if (deg < 180)
        return "South-East";
    if (deg == 180)
        return "South";
    if (deg < 270)
        return "South-West";
    if (deg == 270)
        return "West";
    if (deg > 270)
        return "North-West";
}

function generateHTML(data) {
    resetResult();
    
    if(data.cod != 200) {
        alert("Something is wrong. Please check your input values and try again.");
        window.location.href = "index.html";
    }

    if(data.sys.country == undefined) {
        let location = document.getElementById("location");
        location.innerHTML = "<b>There is no country there 👀</b>";
    }
    else {
        let url = "https://restcountries.com/v3.1/alpha/" + data.sys.country;
        fetch(url)
        .then((res) => res.json())
        .then((restData) => {
            let location = document.getElementById("location");
            location.innerHTML = "<b>" + data.name + ", " + restData[0].name.common + "</b> " + restData[0].flag;
        });
    }
    let condition = document.getElementById("condition");
    condition.innerHTML = "<b>⛅️ Condition:</b> " + data.weather[0].main;

    let specialNote = document.getElementById("special-note");

    condition = data.weather[0].main;

    if(condition == "Thunderstorm") {
        specialNote.innerHTML = "<b>Special Note:</b> " + "You may see lightning there ⚡️";
    }
    else
    if(condition == "Drizzle") {
        specialNote.innerHTML = "<b>Special Note:</b> " + "There can be heavy rain outside 🌧️";
    }
    else
    if(condition == "Rain") {
        specialNote.innerHTML = "<b>Special Note:</b> " + "Do not forget to bring your umbrella ☂️";
    }
    else
    if(condition == "Snow") {
        specialNote.innerHTML = "<b>Special Note:</b> " + "You can build a snowman right now ☃️";
    }
    else if(condition == "Clear") {
        specialNote.innerHTML = "<b>Special Note:</b> " + "Good time for a nice football match ⚽️";
    }

    else if(condition == "Clouds") {
        specialNote.innerHTML = "<b>Special Note:</b> " + "Check out the weather and wear well 👕";
    }
    else {
        specialNote.innerHTML = "<b>Special Note:</b> " + "Be careful with wind and fog 🌬️";
    }

    let description = document.getElementById("description");
    description.innerHTML = "<b>📄 Description:</b> " + data.weather[0].description;

    let humidity = document.getElementById("humidity");
    humidity.innerHTML = "<b>💧 Humidity:</b> " + data.main.humidity + "%";

    let pressure = document.getElementById("pressure");
    pressure.innerHTML = "<b>📊 Pressure:</b> " + data.main.pressure + " hPA";

    let windSpeed = document.getElementById("wind-speed");
    windSpeed.innerHTML = "<b>🏎️ Wind Speed:</b> " + data.wind.speed + " km/h";

    let windDir = document.getElementById("wind-direction");
    windDir.innerHTML = "<b>🧭 Wind Direction:</b> " + convert(data.wind.deg) + " (" + data.wind.deg + "°)";

    let temp = document.getElementById("temp");
    temp.innerHTML = "<b>🌡️ Temp:</b> " + data.main.temp + " " + celcius;

    let minTemp = document.getElementById("min-temp");
    minTemp.innerHTML = "<b>📉 Min:</b> " + data.main.temp_min + " " + celcius;

    let maxTemp = document.getElementById("max-temp");
    maxTemp.innerHTML = "<b>📈 Max:</b> " + data.main.temp_max + " " + celcius;

    let realFeel = document.getElementById("real-feel");
    realFeel.innerHTML = "<b>😶‍🌫️ Feels Like:</b> " + data.main.feels_like + " " + celcius;

    let unix = data.dt * 1000.000;
    let date = new Date(unix);
    let localTime = date.toLocaleTimeString("en-US");
    let localDate = date.toLocaleDateString("en-US");

    let latestResponse = document.getElementById("latest-response");
    latestResponse.innerHTML = "<b>Latest Response:</b> " + localTime + " " + localDate;
}