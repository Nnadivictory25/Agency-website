mapboxgl.accessToken = "pk.eyJ1Ijoibm5hZGl2aWN0b3J5IiwiYSI6ImNsY3EzaXZqNzAyMzIzb3AxdzM0NHdtbjgifQ.TZZSs7x8-ndh-gruJfW-vw";
// Replace DEFAULT_LATITUDE and DEFAULT_LONGITUDE with the default location's coordinates
const defaultLatitude = 37.828724;
const defaultLongitude = -122.355537;

let map;
let marker;

function initMap() {
  // Create a new map
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [defaultLongitude, defaultLatitude],
    zoom: 7,
  });
  marker = new mapboxgl.Marker()
    .setLngLat([defaultLongitude, defaultLatitude])
    .addTo(map);

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: {
      color: "orange",
    },
    mapboxgl: mapboxgl,
  });

  map.addControl(geocoder);
}

async function getLatLng(address) {
  // Build the URL for the request
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${mapboxgl.accessToken}`;
  // Make the request
  const response = await fetch(url);
  const data = await response.json();

  // Check if the request was successful and if there are any results
  if (data.features && data.features.length > 0) {
    // Get the first result's coordinates
    const location = data.features[0].center;
    return { lat: location[1], lng: location[0] };
  } else {
    // Return the default location if the request was not successful or there are no results
    return { lat: defaultLatitude, lng: defaultLongitude };
  }
}



//! MOBILE NAVBAR TOGGLE FUNCTION
const mobileNav = document.querySelector('.mobileNav')
const openNav = document.querySelector('.openNav')
const closeNav = document.querySelector('.closeNav')
const listItems = Array.from(document.querySelectorAll('.mobileLi'))
const body = document.querySelector('body')


const openNavBar = () => {
  mobileNav.style.top = '5rem';
  openNav.classList.toggle('hidden')
  closeNav.classList.toggle('hidden')
  body.classList.toggle('noScroll')
}

const closeNavBar = () => {
  mobileNav.style.top = '-150%';
  closeNav.classList.toggle('hidden')
  openNav.classList.toggle('hidden')
  body.classList.toggle('noScroll')
}

listItems.forEach(li => {
  li.addEventListener('click', closeNavBar)
})



openNav.addEventListener('click', openNavBar)
closeNav.addEventListener('click', closeNavBar)


// ! MAP SEARCH FUNCTIONS
const searchInput = document.querySelector('#locationInput')


searchInput.addEventListener('keyup', () => {
  document.querySelector('.mapboxgl-ctrl-geocoder--input').value = searchInput.value
  document.querySelector('.mapboxgl-ctrl-geocoder--input').focus()
})

setTimeout(() => {
  document.querySelector('.mapboxgl-ctrl-geocoder--input').addEventListener('change', () => {
    searchInput.value =  document.querySelector('.mapboxgl-ctrl-geocoder--input').value
  })
  document.querySelector('.mapboxgl-ctrl-geocoder--input').addEventListener('keyup', () => {
    searchInput.value =  document.querySelector('.mapboxgl-ctrl-geocoder--input').value
  })
}, 1000);




function searchCountry() {
  const address = searchInput.value;
  getLatLng(address).then((location) => {
    marker.setLngLat(location);
    map.panTo(location);
  });
}