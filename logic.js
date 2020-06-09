// Load in geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

var geojson;
// function creates map with earthquake markers wtih provided GeoJSON object
function createMap(geoData) {
  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  // Create the map object with layers
  var map = L.map("map", {
    center: [30,-15],
    zoom: 2,
    maxZoom: 18,
    tileSize: 512});

  // Add lightmap to main map
  lightmap.addTo(map);

  // add geoJSON feature L.geoJSON(geojsonFeature).addTo(map)
  L.geoJSON(geoData, {
    pointToLayer: (feature, latlng) => { return L.circleMarker(latlng) }
  }).addTo(map);}

// .bindPopup(popupContent, { className: 'popup' }).addTo(map);
// }
// Perform an API call to the earthquake with d3
// d3.json(geoData, function(data) {
//   createFeatures(data.features);

//   // Pull the "features" property from data
//   var earthQuake = data.features;
//   console.log(earthQuake);
//   // from features get relavent info from geoJSON
//   earthQuake.forEach(quake => {
//     var mag = quake.properties.mag;
//     var magType = quake.properties.magType;
//     var coordinates = quake.geometry.coordinates;
//     var place =quake.properties.place;
//     console.log(mag);
//     console.log(magType);
//     console.log(coordinates);
//     console.log(place);
//   });
  

// });

// function createFeatures(earthquakeData){
//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   }
//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });
//   // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
// }

// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMap);