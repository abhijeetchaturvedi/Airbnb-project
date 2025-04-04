mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: data.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10// starting zoom
});

console.log(data.geometry.coordinates)
const marker = new mapboxgl.Marker({
    color: "red",
    draggable: true
}).setLngLat(data.geometry.coordinates)
    .addTo(map)
    .setPopup(new mapboxgl
        .Popup()
        .setHTML(`<h5>Exact Location of ${data.title}<h5/><p>location:${data.location}</p>`)
        .addClassName("map-pop")
    )