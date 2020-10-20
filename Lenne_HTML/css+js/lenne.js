// ================= LAYERS ================= 
// mapbox.com
var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';

// streets
var streets = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr}),
	satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr}),
	streets_satellite = L.tileLayer(mbUrl, {id: 'mapbox.streets-satellite', attribution: mbAttr}),
	outdoors = L.tileLayer(mbUrl, {id: 'mapbox.outdoors', attribution: mbAttr}),
	run_bike_hike = L.tileLayer(mbUrl, {id: 'mapbox.run-bike-hike', attribution: mbAttr});

// openstreetmap.org
var osmAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
	osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osm = L.tileLayer(osmUrl, {attribution: osmAttrib});

// WebAtlasDE BKG
var wms_webatlasde = L.tileLayer.wms("http://sg.geodatenzentrum.de/wms_webatlasde.light", {
    layers: 'webatlasde.light',
    format: 'image/png',
    transparent: true,
    attribution: '&copy; GeoBasis-DE / <a href="http://www.bkg.bund.de">BKG</a> 2016'
});

// Eigene Deutschland Karte
var germany = L.geoJson(deutschland, {
  style: {
    color: "#000",
    fillColor: "#fff",
    fillOpacity: 0,
    opacity: 1,
    weight: 1,
    clickable: false
  }
});


// ================= MAP ================= 
// Karte erzeugen
var map = L.map('map', {
	center: [51,10.5],
	zoom: 6,
	layers: [germany]
});

// Darstellung der Punkte von Parks in GeoJSON-Format
var geojsonMarkerOptions = {
	radius: 5,
	color: "#f00",
	opacity: 1,
	weight: 1,
	fillColor: "#f00",
	fillOpacity: 0.5
};

var geojsonMarkerOptionsEmpty = {
	fill: false,
	stroke: false
};

// Anzeige der Daten beim Klicken auf einem Punkt
function onEachFeature(feature, layer) {
  
  // Nur wenn Daten (z.B. Place, Year, Text) in der JSON-Datei vorhanden sind ausgeben
  if (feature.properties && feature.properties.place) {
    html_content = "<b>Name:</b> " + feature.properties.place + "<br/>";
    if (feature.properties.year) {
      html_content +=  "<b>Jahr:</b> " + feature.properties.year + "<br/>";
    }
    if (feature.properties.text) {
      html_content +=  "<b>Text:</b> " + feature.properties.text + "<br/>";
    }
    
    // Bild anzeigen (Name = Bildname)
    // Zeichenersetzung der Namen (Nur Kleinbuchstaben, Umlaute, und sonstige Zeichen zu Unterstrich)
    var imgname = feature.properties.place.toLowerCase();
    imgname = unescape(encodeURIComponent(imgname));
    imgname = imgname.replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/Ä/g,"Ae").replace(/Ö/g,"Oe").replace(/Ü/g,"Ue").replace(/ß/g,"ss");
    imgname = imgname.replace(/[^A-Z0-9]+/ig, "_");
    html_content += "<a href='./pics/"  + imgname + ".JPG' target='_blank'><img src='./pics/"  + imgname + ".JPG' width=300px onerror='this.src=\"./pics/0.jpg\"; this.style.display = \"none\";'/></a>";
    layer.bindPopup(html_content, { autoPan: false });
    layer.bindLabel(feature.properties.place, { className: "myLabel", noHide: false});
	}
}

// Marker setzen
var geojsonLayer = L.geoJson(lenneparks, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, geojsonMarkerOptions);
	},
	onEachFeature: onEachFeature
}).addTo(map);

// Label setzen
var geojsonLabel = L.geoJson(lenneparks, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, geojsonMarkerOptionsEmpty);
	},
	onEachFeature: function (feature, layer) {
		layer.bindLabel(feature.properties.place, { className: "myLabel", noHide: true});
	}
}).addTo(map);


// ================= Layer Control ================= 
var baseLayers = {
  "Deutschland": germany,
	"OpenStreetMap": osm,
	"Streets": streets,
	"Satellite": satellite,
	"Streets + Satellite": streets_satellite,
	"Outdoors": outdoors,
	"Run Bike Hike": run_bike_hike,
	"WebAtlasDE.light": wms_webatlasde
};

var overlays = {
	//"Parks": geojsonLayer,
	"Beschriftung": geojsonLabel
}

L.control.layers(baseLayers, overlays).addTo(map);