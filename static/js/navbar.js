function curTime() {
    const date = new Date();
    // Replaced implicit global variable with 'const'
    const display_date = date.toLocaleTimeString("en-US");
    const title = document.getElementById("time");
    if (title) {
        title.innerHTML = display_date;
    }
}

const api_url = "https://wttr.in/?format=j2";

async function getWeather() {
    try {
        const response = await fetch(api_url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const weather = data.current_condition[0];
        const location = data.nearest_area[0];
        const temp = weather.temp_C;
        const city = location.areaName[0].value;
        
        const weatherElement = document.getElementById("weather");
        if (weatherElement) {
            weatherElement.innerHTML = `${city}: ${temp}℃`;
        }
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        const weatherElement = document.getElementById("weather");
        if (weatherElement) {
            weatherElement.innerHTML = "Weather unavailable";
        }
    }
}

// Initialize
getWeather();
curTime();
setInterval(curTime, 1000);