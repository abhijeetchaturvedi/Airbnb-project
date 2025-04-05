// mapboxgl.accessToken = mapToken

// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     center: data.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
//     zoom: 10// starting zoom
// });

// console.log(data.geometry.coordinates)
// const marker = new mapboxgl.Marker({
//     color: "red",
//     draggable: true
// }).setLngLat(data.geometry.coordinates)
//     .addTo(map)
//     .setPopup(new mapboxgl
//         .Popup()
//         .setHTML(`<h5>Exact Location of ${data.title}<h5/><p>location:${data.location}</p>`)
//         .addClassName("map-pop")
//     )

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
//   style: 'mapbox://styles/mapbox/light-v11',  Airbnb-style clean base
  style: 'mapbox://styles/mapbox/streets-v12',



  center: data.geometry.coordinates,
  zoom: 12,
});

// Create Airbnb-style marker
const markerEl = document.createElement('div');
markerEl.className = 'airbnb-marker';

// Add popup
const popup = new mapboxgl.Popup({ offset: 30, closeOnClick: true })
  .setHTML(`
    <div class="map-popup">
      <h5>${data.title}</h5>
      <p><i class="fa-solid fa-location-dot"></i> ${data.location}</p>
    </div>
  `);

// Add marker to map
new mapboxgl.Marker(markerEl)
  .setLngLat(data.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
