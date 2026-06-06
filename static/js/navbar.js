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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const weather = data.current_condition[0];
        const location = data.nearest_area[0];
        
        const temp = weather.temp_C;
        const desc = weather.weatherDesc[0].value; // e.g., "Light Rain", "Clear"
        const city = location.areaName[0].value;
        
        // 1. Update Navbar text
        const weatherElement = document.getElementById("weather");
        if (weatherElement) {
            weatherElement.innerHTML = `${city}: ${temp}℃, ${desc}`;
        }

        // 2. Dashboard Warning Logic
        const warningElement = document.getElementById("weather-warning");
        if (warningElement) {
            // Define conditions that should trigger a warning
            const hazardousConditions = ['rain', 'snow', 'storm', 'fog', 'drizzle', 'shower', 'ice'];
            const isBadWeather = hazardousConditions.some(condition => desc.toLowerCase().includes(condition));

            if (isBadWeather) {
                warningElement.textContent = `Weather Alert: ${desc} in ${city} may cause delivery delays.`;
                warningElement.style.display = 'list-item'; // Un-hide the element
            }
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