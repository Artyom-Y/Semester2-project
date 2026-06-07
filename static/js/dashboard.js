// This function is called automatically by the Google Maps script tag (note: import google maps after other scripts, it breakes otherwise)
function initMap() {
    // Parse the orders from the HTML (we put them there with jinja)
    const ordersDataElement = document.getElementById("orders-data");
    if (!ordersDataElement) return;
    
    const rawOrders = JSON.parse(ordersDataElement.textContent);

    // New map object centered on Paris
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: { lat: 48.8566, lng: 2.3522 },
        styles: [ { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] } ]
    });

    // Show traffic
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    const warningList = document.getElementById("warning-list");
    const currentHour = new Date().getHours();

    // Iterate through orders and create zones array
    const zones = {};
    rawOrders.forEach(order => {
        if (!zones[order.zone]) {
            zones[order.zone] = { count: 0, hasTempSensitive: false };
        }
        zones[order.zone].count += 1;
        if (order.temp_sensitive === 1) {
            zones[order.zone].hasTempSensitive = true;
        }

        // Process Time Warnings (we consider orders within 2 hours as urgent)
        if (order.deadline) {
            const deadlineHour = parseInt(order.deadline.split(':')[0]);
            if (deadlineHour >= currentHour && deadlineHour <= currentHour + 2) {
                const li = document.createElement("li");
                li.textContent = `Urgent: Order #${order.ord_id} to zone ${order.zone} is due at ${order.deadline}`;
                warningList.appendChild(li);
            }
        }
        
        // Refrigerated orders outside of Paris are marked
        if (order.temp_sensitive === 1 && !order.zone.toString().startsWith("700")) {
            const li = document.createElement("li");
            li.textContent = `Transit Risk: Refrigerated Order #${order.ord_id} heading to outer suburb (${order.zone})`;
            warningList.appendChild(li);
        }
    });

    // Plot the grouped zones on the map
    for (const [zoneId, data] of Object.entries(zones)) {
        let coords = getApproximateCoords(zoneId);
        coords = jitterCoord(coords);
        
        // Blue if temp sensitive, Green if normal
        const dotColor = data.hasTempSensitive ? "#3B82F6" : "#10B981";

        // Define an SVG dot
        const svgDot = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: dotColor,
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#0B1120",
            scale: 7 + (data.count * 0.3) // More orders = bigger dot
        };

        // Create the Marker instead of a Circle
        const marker = new google.maps.Marker({
            position: coords,
            map: map,
            icon: svgDot,
            title: `Zone: ${zoneId}`
        });

        // Zone and total orders window
        const infoWindow = new google.maps.InfoWindow({
            content: `<div class="custom-info-window"><strong>Zone: ${zoneId}</strong> Total Orders: ${data.count}</div>`
        });

        // Open the window above on click
        marker.addListener("click", () => {
            infoWindow.open({
                anchor: marker,
                map,
                shouldFocus: false,
            });
        });
    }

    // Put facilities on the map (in our case there's 1, but the app supports more)
    const facilitiesDataElement = document.getElementById("facilities-data");
    const rawFacilities = JSON.parse(facilitiesDataElement.textContent)
    rawFacilities.forEach(facility => {
            let coords = getApproximateCoords(facility.zone);
            coords = jitterCoord(coords);

            const svgArrow = {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            strokeColor: "#ed1f1f",
            scale: 5
            };

            const marker = new google.maps.Marker({
            position: coords,
            map: map,
            icon: svgArrow,
            title: `Zone: ${facility.zone}`
            });
        });
}

// Helper function to generate approximate coordinates based on the postal codes
function getApproximateCoords(postalCode) {
    const codeStr = postalCode.toString();
    const baseLat = 48.8566; 
    const baseLng = 2.3522;
    // Offset so markers don't stack on top of each other (an issue when several orders are in the same zone)
     

    if (codeStr.startsWith('700')) { // Paris
        return { lat: 48.8566, lng: 2.3522};
    } else if (codeStr.startsWith('93')) { // Seine-Saint-Denis
        return { lat: 48.9207, lng: 2.4863};
    } else if (codeStr.startsWith('92')) { // Hauts-de-Seine
        return { lat: 48.8484, lng: 2.1795};
    } else if (codeStr.startsWith('94')) { // Val-de-Marne
        return { lat: 48.7798, lng: 2.4794};
    }
    return { lat: baseLat, lng: baseLng };
}
// Added this because using geocoding is expensive. This emulates order's location
function jitterCoord(coord, amount=0.05) {
    const sign = Array(1, -1)
    return {
        lat: coord.lat + (Math.random() - 0.5) * amount * sign[Math.floor(Math.random() * sign.length)],
        lng: coord.lng + (Math.random() - 0.5) * amount * sign[Math.floor(Math.random() * sign.length)],
        };
}