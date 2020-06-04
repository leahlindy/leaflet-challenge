var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// add main map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  accessToken: API_KEY
});

// Initialize all of the LayerGroups that will be used in map 
var layers = {
  layer1: new L.LayerGroup(),
  layer2: new L.LayerGroup(),
  layer3: new L.LayerGroup(),
  layer4: new L.LayerGroup(),
  layer5: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map", {
  center: [30,-15],
  zoom: 2,
  layers: [
    layers.layer1,
    layers.layer2,
    layers.layer3,
    layers.layer4,
    layers.layer5
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);