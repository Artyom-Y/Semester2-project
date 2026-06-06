// This function is called automatically by the Google Maps script tag
function initMap() {
    // 1. Safely retrieve and parse the orders from the HTML
    const ordersDataElement = document.getElementById("orders-data");
    if (!ordersDataElement) return; // Fail gracefully if data is missing
    
    const rawOrders = JSON.parse(ordersDataElement.textContent);

    // 2. Initialize the Map centered on Paris
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: { lat: 48.8566, lng: 2.3522 },
        styles: [ { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] } ]
    });

    // Enable live traffic layer
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    const warningList = document.getElementById("warning-list");
    const currentHour = new Date().getHours();

    // 3. Group orders by postal code (zone)
    const zones = {};
    rawOrders.forEach(order => {
        if (!zones[order.zone]) {
            zones[order.zone] = { count: 0, hasTempSensitive: false };
        }
        zones[order.zone].count += 1;
        if (order.temp_sensitive === 1) {
            zones[order.zone].hasTempSensitive = true;
        }

        // Process Time Warnings
        if (order.deadline) {
            const deadlineHour = parseInt(order.deadline.split(':')[0]);
            if (deadlineHour >= currentHour && deadlineHour <= currentHour + 2) {
                const li = document.createElement("li");
                li.textContent = `Urgent: Order #${order.ord_id} to zone ${order.zone} is due at ${order.deadline}`;
                warningList.appendChild(li);
            }
        }
        
        // Process Distance/Refrigeration Warnings (Flagging suburbs)
        if (order.temp_sensitive === 1 && !order.zone.toString().startsWith("700")) {
            const li = document.createElement("li");
            li.textContent = `Transit Risk: Refrigerated Order #${order.ord_id} heading to outer suburb (${order.zone})`;
            warningList.appendChild(li);
        }
    });

    // 4. Plot the grouped zones on the map
    for (const [zoneId, data] of Object.entries(zones)) {
        const coords = getApproximateCoords(zoneId);
        
        // Blue if temp sensitive, Green if normal
        const dotColor = data.hasTempSensitive ? "#3B82F6" : "#10B981";

        // Define a clean, solid SVG dot
        const svgDot = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: dotColor,
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#0B1120", // Matches your deep navy theme for a crisp border
            scale: 7 + (data.count * 0.3) // Starts small at 7px, grows very slightly with order volume
        };

        // Create the Marker instead of a Circle
        const marker = new google.maps.Marker({
            position: coords,
            map: map,
            icon: svgDot,
            title: `Zone: ${zoneId}` // Native tooltip on hover
        });

        // Keep your custom InfoWindow
        const infoWindow = new google.maps.InfoWindow({
            content: `<div class="custom-info-window"><strong>Zone: ${zoneId}</strong>Total Orders: ${data.count}</div>`
        });

        // Open the InfoWindow anchored to the new dot when clicked
        marker.addListener("click", () => {
            infoWindow.open({
                anchor: marker,
                map,
                shouldFocus: false,
            });
        });
    }
}

// Helper: Generate approximate coordinates based on mock Île-de-France postal codes
function getApproximateCoords(postalCode) {
    const codeStr = postalCode.toString();
    const baseLat = 48.8566; 
    const baseLng = 2.3522;
    // Deterministic offset so markers don't stack perfectly on top of each other
    const offset = (parseInt(postalCode) % 100) * 0.0015; 

    if (codeStr.startsWith('700')) { // Paris
        return { lat: baseLat + (offset % 0.02), lng: baseLng + offset };
    } else if (codeStr.startsWith('93')) { // Seine-Saint-Denis (NE)
        return { lat: baseLat + 0.05 + offset, lng: baseLng + 0.06 - offset };
    } else if (codeStr.startsWith('92')) { // Hauts-de-Seine (W)
        return { lat: baseLat - 0.02 + offset, lng: baseLng - 0.07 + offset };
    } else if (codeStr.startsWith('94')) { // Val-de-Marne (SE)
        return { lat: baseLat - 0.05 + offset, lng: baseLng + 0.05 + offset };
    }
    return { lat: baseLat, lng: baseLng };
}