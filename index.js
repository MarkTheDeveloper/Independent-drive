// huys course list left index park menu or park infomation 
window.onload = function () {
    const courseList = document.getElementById("course-list");
  
    fetch('data/data.json')
      .then(response => response.json())
      .then(information => {
        information.forEach((course) => {
          const courseDiv = document.createElement("div");
          courseDiv.classList.add("course-item");
  
          courseDiv.innerHTML = `
            <img src="${course.imageUrl}" alt="${course.course_name}" class="course-img" />
  
            <div class="course-info">
              <h3 class="course-name">${course.course_name}</h3>
              <p class="course-email"><strong>Email:</strong> ${course.contact_info.email}</p>
              <p class="course-phone"><strong>Phone:</strong> ${course.contact_info.phone}</p>
              <p class="course-address"><strong>Address:</strong> ${course.contact_info.address}</p>
              <a href="${course.parkMapUrl}" target="_blank" class="view-map-btn">View Map</a>
            </div>
          `;
  
          courseList.appendChild(courseDiv);
        });
      })
      .catch(error => console.error('error! file JSON:', error));
  };
  


  // <----------------------The API MAP Section Painnnnnnnn------------------>
  //   <!-- Had a lot of help from AI when making the map and API code. -->
// Setup the map
var map = L.map('mapArea').setView([45.0, -95.0], 4);

// Tile layers
var defaultTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
var darkTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap contributors' });
var satTile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' });

// Marker cluster group
var markerCluster = L.markerClusterGroup();
var allMarkers = [];

// Custom icons
var greenIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30,30], iconAnchor: [15,30], popupAnchor: [0,-30]
});
var blueIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
    iconSize: [30,30], iconAnchor: [15,30], popupAnchor: [0,-30]
});

// Load course data
fetch('data/export.geojson')
.then(res => res.json())
.then(data => {
    var features = L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            var holes = feature.properties.holes || 'Unknown';
            var markerIcon = (holes.toString().includes('9')) ? greenIcon : blueIcon;
            var marker = L.marker(latlng, { icon: markerIcon });

            var name = feature.properties.name || 'Name Not Available';
            var province = feature.properties.province || 'Province Unknown';
            var year = feature.properties.year_established || 'Year Unknown';

            marker.bindPopup('<b>' + name + '</b><br>Holes: ' + holes + '<br>' + province + '<br>Established: ' + year + '<br><a target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=' + latlng.lat + ',' + latlng.lng + '">Get Directions</a>');
            marker.feature = feature;
            allMarkers.push(marker);
            return marker;
        }
    });
    markerCluster.addLayer(features);
    map.addLayer(markerCluster);
    document.getElementById('loader').style.display = 'none';
    updateSideList();
});

// Location tracking
map.locate({ setView: true, maxZoom: 12 });

map.on('locationfound', function(e) {
    L.marker(e.latlng).addTo(map).bindPopup('You are here!').openPopup();
    findNearestPark(e.latlng);
});

map.on('locationerror', function(e) { console.log('Location blocked'); });

function findNearestPark(userLatLng) {
    var nearestMarker = null;
    var nearestDistance = Infinity;
    allMarkers.forEach(m => {
        var d = map.distance(userLatLng, m.getLatLng());
        if (d < nearestDistance) { nearestDistance = d; nearestMarker = m; }
    });
    if (nearestMarker) {
        L.polyline([userLatLng, nearestMarker.getLatLng()], { color: 'blue' }).addTo(map);
        nearestMarker.openPopup();
    }
}

function findNearestAgain() { map.locate(); }

// Tile switching
function setDefaultTile() { resetTiles(); defaultTile.addTo(map); markerCluster.addTo(map); }
function setDarkTile() { resetTiles(); darkTile.addTo(map); markerCluster.addTo(map); }
function setSatTile() { resetTiles(); satTile.addTo(map); markerCluster.addTo(map); }
function resetTiles() {
    map.eachLayer(function(layer) { map.removeLayer(layer); });
}

// Searches parks auto filters while the user types out the park name
document.getElementById('search').addEventListener('input', function() {
    var text = this.value.toLowerCase();
    markerCluster.clearLayers();
    var filt = allMarkers.filter(m => {
        var n = m.feature.properties.name || '';
        return n.toLowerCase().includes(text);
    });
    markerCluster.addLayers(filt);
    updateSideList(filt);
});

// Handle Find Button click seraches for the park user wants
document.getElementById('findButton').addEventListener('click', function() {
  var searchText = document.getElementById('search').value.toLowerCase();
  var found = false;

  allMarkers.forEach(marker => {
    var name = marker.feature.properties.name || '';
    if (name.toLowerCase().includes(searchText)) {
      map.flyTo(marker.getLatLng(), 14);
      marker.openPopup();
      found = true;
    }
  });

  if (!found) {
    alert('No park found with that name.');
  }
});


// Toggle full screen mode for map this was paiinnnnn 
function toggleFullScreen() {
  var mapWrapper = document.getElementById('map-wrapper');
  var mapArea = document.getElementById('mapArea');

  if (!document.fullscreenElement) {
    mapWrapper.requestFullscreen().then(() => {
      // when full screen, expand the map size
      mapArea.style.height = '100vh';
      mapArea.style.width = '100vw';
    }).catch(err => {
      alert(`Error trying to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen().then(() => {
      // when exit full screen, reset the map size
      mapArea.style.height = '600px';
      mapArea.style.width = '100%';
    });
  }
}
 // <----------------------The API MAP Section !END!------------------>