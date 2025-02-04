

// get your key from app.tomorrow.io/development/keys
const API_KEY = 'add your API key here'; 

// pick the field (like temperature, precipitationIntensity or cloudCover)
const DATA_FIELD = 'precipitationIntensity';

// set the ISO timestamp (now for all fields, up to 6 hour out for precipitationIntensity)
// const TIMESTAMP = (new Date()).toISOString(); 

// initialize the map
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {
      lat: 42.355438,
      lng: -71.059914
    }
  });

  // inject the tile layer
  var imageMapType = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      if (zoom > 12) {
        return null;
      }

      return `https://api.tomorrow.io/v4/map/tile/${zoom}/${coord.x}/${coord.y}/${DATA_FIELD}/${TIMESTAMP}.png?apikey=${API_KEY}`;
    },
    tileSize: new google.maps.Size(256, 256)
  });

  map.overlayMapTypes.push(imageMapType);
}
