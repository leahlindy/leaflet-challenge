// function to display popup content for each feature 
// information for each feature within properties
function popupBox(earthquake) {
  var properties = earthquake.feature.properties;
  let date = new Date(properties.time);
  return `<strong>Magnitude: ${properties.mag}</strong><br><a href="${properties.url}">${properties.place}</a><br>${date.toUTCString()}`;
}

// getColor function will get colours for graded magnitudes (1- 5+) - colorbrewer
function getColor(d) {
  return d < 1  ? '#fef0d9' :
         d < 2  ? '#fdcc8a' :
         d < 3  ? '#fc8d59' :
         d < 4  ? '#e34a33' :
         d < 5  ? '#b30000' :
         '#800026';
};


// Create function to make legend layer
function legendLayer() {
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {

      var div = L.DomUtil.create('div', 'info legend');
      var mags = [0, 1, 2, 3, 4, 5];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mags[i]) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }

      return div;
  };
  return legend;
}

// This function styles each feature
function stylePoint(feature) {
  var scale = 1.7;
  var mag = feature.properties.mag;
  
  return {
      color: 'white',
      weight: .5,
      fillColor: getColor(mag),
      fillOpacity: .6,
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

  // add geoJSON feature L.geoJSON(geojsonFeature).addTo(map)
  L.geoJSON(geoData, {
    pointToLayer: (feature, latlng) => { return L.circleMarker(latlng,stylePoint(feature))},
    }).addTo(map).bindPopup(popupBox).addTo(map);
  
  //add legend function to map
  legendLayer().addTo(map);
  }

var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform an API call to the earthquake API and call createmap function
d3.json(url,createMap)