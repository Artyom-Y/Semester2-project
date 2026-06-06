
function curTime() {
    const date = new Date();
    display_date = date.toLocaleTimeString("en-US");
    let title = document.getElementById("time");
    title.innerHTML = display_date;
}

const api_url = "https://wttr.in/?format=j2";

async function getWeather() {
    const response = await fetch(api_url);
    const data = await response.json();
    const weather = data.current_condition[0];
    const location = data.nearest_area[0];
    let temp = weather.temp_C;
    let city = location.areaName[0].value;
    document.getElementById("weather").innerHTML = city + ": " + temp + "℃";
}

getWeather();
curTime();
setInterval(curTime, 1000);