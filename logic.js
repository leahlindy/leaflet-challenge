// Load in geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// function to display popup content for each feature 
// information for each feature within properties
function popupBox(earthquake) {
  var properties = earthquake.feature.properties;
  let date = new Date(properties.time);
  return `<strong>Magnitude: ${properties.mag}</strong><br><a href="${properties.url}">${properties.place}</a><br>${date.toUTCString()}`;
}

// getColor function will get colours for graded magnitudes - colorbrewer
function getColor(d) {
  return d < 1  ? '#fef0d9' :
         d < 2  ? '#fdcc8a' :
         d < 3  ? '#fc8d59' :
         d < 4  ? '#e34a33' :
         d < 5  ? '#b30000' :
         '#800026';
};

// Create function to make layers
function legendLayer() {
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {

      var div = L.DomUtil.create('div', 'info legend');
      var grades = [0, 1, 2, 3, 4, 5];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i]) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };
  return legend;
}
// This function styles each feature
function stylePoint(feature) {
  var scale = 4;
  var mag = feature.properties.mag;
  
  return {
      color: 'white',
      weight: 1,
      fillColor: getColor(mag),
      fillOpacity: 1.0,
      radius: mag * scale
  };
}


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

  


  // var geojsonMarkerOptions = {
  //   radius: 8,
  //   fillColor: getColor(geoData.properties.mag),
  //   color: "#000",
  //   weight: 1,
  //   opacity: 1,
  //   fillOpacity: 0.8
  // };

  // add geoJSON feature L.geoJSON(geojsonFeature).addTo(map)
  L.geoJSON(geoData, {
    pointToLayer: (feature, latlng) => { return L.circleMarker(latlng,stylePoint)
    .addTo(map)
    .bindPopup(popupBox, { className: 'popup' }).addTo(map);
  
  //add legend function to map
  legendLayer().addTo(map);
  }}

//
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
var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// Perform an API call to the earthquake API and call createmap function
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMap);
d3.json(url,createMap)