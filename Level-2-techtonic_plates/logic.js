// Same code as step 1- changes are:
// Create layer for techtonic plates
// Create toggle to display techtonic plates
// Try adding a hover over earthquakes/plates rather than techtonic plates
// Create layer for techtonic plates boundaries


// separate function for earthquake and boundaries - to be added as variables
var boundaries;
// plate boundary function will apply style with the json data for boundaries
function mapBoundaries(data){
  boundaries = L.geoJSON(data, {
    style: {
        color: 'blue', // base layers can change that
        weight: 2
    }
  });
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

// // define geojson with listeners for techtonic plates
// var geojson;
// // ... our listeners
// geojson = L.geoJson(boundaries);
// // call the highlightFeature and reset highlight for interactive mouse-over events
// function highlightFeature(e) {
//   var layer = e.target;

//   layer.setStyle({
//       weight: 5,
//       color: '#666',
//       dashArray: '',
//       fillOpacity: 0.7
//   });

//   if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//       layer.bringToFront();
//   }
// }
// function resetHighlight(e) {
//   geojson.resetStyle(e.target);
// }

// function onEachFeature(feature, layer) {
//   layer.on({
//       mouseover: highlightFeature,
//       mouseout: resetHighlight
//   });
// }

// geojson = L.geoJson(boundaries, {
//   style: styleBound,
//   onEachFeature: onEachFeature
// }).addTo(map);

// // Info layer- hover over info box rather than popup
// var info = L.control();

// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };

// // method that we will use to update the control based on feature properties passed
// info.update = function (props) {
//   this._div.innerHTML = '<h4>Earthquake</h4>' +  (props ?
//       '<b>' + props.name + '</b><br />' + props.mag + 'Daily Global Earthquakes'
//       : 'Hover over a point');
// };

// info.addTo(map);

// function highlightFeature(e) {
//   info.update(layer.feature.properties);
// }

// function resetHighlight(e) {
//   info.update();
// }


// this function style boundaries
function styleBound() {
  return {
      fillColor: 'grey',
      weight: 2,
      opacity: .5,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
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

// Pop-up box for earthquak information
function popupBox(earthquake) {
  var properties = earthquake.feature.properties;
  let date = new Date(properties.time);
  return `<strong>Magnitude: ${properties.mag}</strong><br><a href="${properties.url}">${properties.place}</a><br>${date.toUTCString()}`;
}

var legend;
// Create function to make legend layer
function mapLegend() {
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
// variable for earthquake- returned by earthquake function
var earthquakes;

function mapEarthquakes(data){
  // add geoJSON feature for earthquake lat/lng
  earthquakes = 
  L.geoJSON(geoData, {
    pointToLayer: (feature, latlng) => { return L.circleMarker(latlng,stylePoint(feature))},
    }).addTo(map).bindPopup(popupBox).addTo(map);
  
  // call legend
  mapLegend();

}

// // function to make additional maptiles
// function mapTiles(){
//   var tiles=[
//     ['Outdoors','mapbox/outdoors-v11', 'green'],
//     ['Satellite','mapbox/satellite-v9', 'orange']
//   ];
//   var baseMaps={};
//   tiles.forEach(tile=> {
//     var name = tile[0];
//     var id= tile[1];
//     var lineColour = tile[2];

//     var tileLayer= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//       attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//       maxZoom: 18,
//       id: id,
//       accessToken: API_KEY
//       });
  
//     baseMaps[name] = tileLayer;
//      // change boundary colour depending on selected basemap
//     tileLayer.on({
//     add: e => { faultLines.setStyle({color: flColor}) }
//   })
//   })

//   return baseMaps;

// }
// function combines all tiles 
function mapMap(data) {
  // Create the map object with layers
  // var baseMaps = mapTiles();
  
  var overlayMaps = {
    'Techtonic Plates': boundaries,
    'Earthquakes' : earthquakes
  };
  
  // Create the map object with layers
  var map = L.map("map", {
    center: [30,-15],
    zoom: 2,
    maxZoom: 18,
    layers: [boundaries, earthquakes ]
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    }).addTo(map);
  //add legend function to map
  legend.addTo(map);

  L.control.layers(lightmap, overlayMaps, { collapsed: false }).addTo(map);
    
    // Add interactivity: show/hide the legend with earthquakes layer
    earthquakes.on({
        add: e => { legend.addTo(map) },
        remove: e => { legend.remove() }
    });

    // d3.json("PB2002_boundaries.json",mapBoundaries);
    
  }

var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var BoundJson="PB2002_boundaries.json"

d3.json(url, (data) => 
{ mapMap(data); d3.json(boundJSON, 
  (boundaries) => { mapBoundaries(boundaries)})});
