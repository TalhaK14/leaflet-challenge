var myMap = L.map("map", {
  center: [36.7783, -119.4179], 
  zoom: 5
}); 

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

function mapColor(mag) {
  switch(true) {
  case mag > 5:
    return "red";
  case mag > 4:
    return "orange";
  case mag > 3:
    return "yellow";
  case mag > 2:
    return "green";
  case mag > 1:
    return "blue";
  default:
    return "black";
  }
}

function mapRadius(mag) {
  if (mag === 0) {
    return 1
  }
  return mag * 4;
}

d3.json(link).then(function(data) {
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function(feature) {
      return {
        color: "#000000",
        fillColor: mapColor(feature.properties.mag),
        fillOpacity: 1,
        weight: 0.5,
        radius: mapRadius(feature.properties.mag)
      };
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

    }

  }).addTo(myMap);
});
    
var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [0, 1, 2, 3, 4, 5];
  var colors = ["black", "blue", "green", "yellow", "orange", "red"];

  for(var i = 0; i<grades.length; i++) {
    div.innerHTML +=
    "<i style='background: " + colors[i] + "'></i> " +
    grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};

legend.addTo(myMap)