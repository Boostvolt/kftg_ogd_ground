// global variables
var mapname = 'mapbox.satellite';
var dataLayerName = '';
var wmsLayer = '';
var maplayer = '';
var width = document.documentElement.clientWidth;
var height = document.documentElement.clientHeight;

//restrict view of map
const topLeftCorner = L.latLng(47.8157, 8.2538);
const bottomRightCorner = L.latLng(47.2730, 9.77);
const maxBounds = L.latLngBounds(topLeftCorner, bottomRightCorner);

// Init map
var map = L.map('map', {
    maxBounds: maxBounds,
    maxZoom: 17,
    minZoom: 9,
    zoomControl: false,
    attributionControl: false
}).setView([47.54, 9.075], 11);

// change map zoom according to screen width & height
function resizeMap() {
    if (width < 768) {
        map.setZoom(10);
    } else if (width > 1599 && height > 1300) {
        map.setZoom(12);
    } else {
        map.setZoom(11);
    }
}

resizeMap();

// change map zoom according to screen width & height if window gets smaller
window.addEventListener('resize', function () {
    // get the width of the screen after the resize event
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    resizeMap();
});

// Map options
map.scrollWheelZoom.disable(); // handle zooming/scrolling

var zoom = L.control.zoom({ // add zoom control
    position: 'topright'
});
zoom.addTo(map);

L.control.scale().addTo(map); // show scale meter on bottom left corner

var sidebar = L.control.sidebar({ // add sidebar
    container: 'sidebar'
});
sidebar.addTo(map);

var legend = L.control({position: 'bottomright'}); // add legend

// change map style
function changeMapStyle(name) {
    //Add new layer to map
    maplayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: name,
        format: 'images/png',
        accessToken: 'pk.eyJ1IjoiYm9vc3R2b2x0IiwiYSI6ImNrZmptMHpkYTBleXgzM21wemZhd3U5ZjcifQ.-VbXp7FqTI4UaFNpj-Sf8w'
    }).addTo(map);

    //Move wmslayer to front
    if (wmsLayer !== '') {
        wmsLayer.bringToFront();
    }
}

// removes all data (used for no display option bullet point)
function removeAll() {
    map.removeLayer(wmsLayer);
    legend.remove(map);
}

// change wms layer
function changeLayer(id) {
    // save id of radio button
    dataLayerName = id;

    //remove previous data layer & legend
    if (wmsLayer !== '') {
        map.removeLayer(wmsLayer);
        legend.remove(map);
    }

    // add wms layer
    wmsLayer = L.WMS.overlay('https://map.geo.tg.ch/proxy/geofy_chsdi3/bodenuebersicht-profile_bohrungen?access_key=YoW2syIQ4xe0ccJA&', {
        version: '1.3.0',
        format: 'image/png',
        transparent: true,
        opacity: 1.0,
        crs: L.CRS.EPSG4326,
        layers: dataLayerName
    }).addTo(map);

    // show legend (if legend is Hauptboden, then do not display because of size)
    //if (dataLayerName !== 'Hauptboden') {
        legend.onAdd = function () {
            // create legend
            var div = L.DomUtil.create('div', 'info legend');
            var url = 'https://map.geo.tg.ch/proxy/geofy_chsdi3/bodenuebersicht-profile_bohrungen?access_key=YoW2syIQ4xe0ccJA&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=' + dataLayerName + '&format=image/png&STYLE=default';
            div.innerHTML += '<h4>Legende</h4><br>' +
                '<img src=' + url + ' alt="legend" class="legend">';
            return div;
        };
        legend.addTo(map);
    //}
}

// generate map
changeMapStyle(mapname);