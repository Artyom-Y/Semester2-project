function curTime() {
    const date = new Date();
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
        if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
        
        const data = await response.json();
        const weather = data.current_condition[0];
        const location = data.nearest_area[0];
        
        const temp = weather.temp_C;
        const desc = weather.weatherDesc[0].value;
        const city = location.areaName[0].value;
        
        // Updathe weather in navbar
        const weatherElement = document.getElementById("weather");
        if (weatherElement) {
            weatherElement.innerHTML = `${city}: ${temp}℃, ${desc}`;
        }

        // Dashboard weather warning
        const warningElement = document.getElementById("weather-warning");
        if (warningElement) {
            // Conditions that trigger a warning
            const hazardousConditions = ['rain', 'snow', 'storm', 'fog', 'drizzle', 'shower', 'ice'];
            const isBadWeather = hazardousConditions.some(condition => desc.toLowerCase().includes(condition));

            if (isBadWeather) {
                warningElement.textContent = `Weather Alert: ${desc} in ${city} may cause delivery delays.`;
                warningElement.style.display = 'list-item'; // Show the element
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


getWeather();
curTime();
setInterval(curTime, 1000);