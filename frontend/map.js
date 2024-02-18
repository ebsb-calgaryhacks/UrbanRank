
var map;
let lat, lng;
let boundaries;
let infoWindow;

const BAD_COLOUR = "#FF0000"
const AVG_COLOUR = "#34d1d1"
const GOOD_COLOOUR = "#34d13a"

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  if (navigator.geolocation) {
    const geolocation = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    [lat, lng] = [geolocation.coords.latitude, geolocation.coords.longitude]

    map = await new Map(document.getElementById("map"), {
      center: { lat: lat, lng: lng },
      zoom: 12,
    })

    let res = await fetch("http://127.0.0.1:5000/boundaries")
    let temp = await res.json()
    boundaries = temp.boundaries

    for (const [key, coords] of Object.entries(boundaries)) {

      drawPolygon(coords, "#FF0000")
    }
  }
}

async function getMapScores() {
  function getUrlParams() {
    var searchParams = new URLSearchParams(window.location.search);
    var params = {};
    for (let param of searchParams.entries()) {
      params[param[0]] = param[1];
    }
    return params;
  }

  var urlParams = getUrlParams();
  var queryParams = '';


  // Add indicators to query parameters if provided in URL
  if (urlParams['Walkability']) {
    queryParams += '&WALK%20SCORE=' + urlParams['Walkability'];
  }
  if (urlParams['PublicTransportation']) {
    queryParams += '&TRANSIT%20SCORE=' + urlParams['PublicTransportation'];
  }
  if (urlParams['GreenSpaces']) {
    queryParams += '&GREEN%20SPACE%20AREA=' + urlParams['GreenSpaces'];
  }
  if (urlParams['BikePaths']) {
    queryParams += '&BIKE%20SCORE=' + urlParams['BikePaths'];
  }
  if (urlParams['Safety']) {
    queryParams += '&PROPERTY%20CRIME%20RATE=' + urlParams['Safety'];
  }
  if (urlParams['Affordability']) {
    queryParams += '&LOW%20INCOME=' + urlParams['Affordability'];
  }
  // if (urlParams['ElementarySchool']) {
  //     queryParams += '&ElementarySchool=' + urlParams['ElementarySchool'];
  // }
  // if (urlParams['JuniorHighSchool']) {
  //     queryParams += '&JuniorHighSchool=' + urlParams['JuniorHighSchool'];
  // }
  // if (urlParams['HighSchool']) {
  //     queryParams += '&HighSchool=' + urlParams['HighSchool'];
  // }

  // Make GET request with query parameters
  fetch('http://127.0.0.1:5000/getCommunityScores?' + queryParams.slice(1)) // Remove leading '&'
    .then(response => response.json())
    .then(jsonData => {
      // Handle the response data here
      console.log(jsonData);
    })
    .catch(error => {
      // Handle errors here
      console.error('Error:', error);
    });
}

/**
 * 
 * @param {Array<Array<number>>} coords An array of coordinate arrays (2 element inner arrays)
 * @param {String} colour A hex string
 */
const drawPolygon = (coords, colour) => {
  let res = coords.map((point) => {
    const lat = Number(point[1])
    const lng = Number(point[0])

    if (isNaN(lat) || isNaN(lng)) {
      console.log(lat, lng, point[1], point[0]);

    }

    return {
      lat: lat,
      lng: lng
    }
  })



  const polygon = new google.maps.Polygon({
    path: res,
    strokeColor: colour,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: colour,
    fillOpacity: 0.35,
  })
  polygon.setMap(map);
  polygon.addListener("click", (event) => {
    infoWindow.setContent("Sample String")
    infoWindow.setPosition(event.latLng)
    infoWindow.open(map)
  })
  infoWindow = new google.maps.InfoWindow();


}

initMap();
getMapScores();
