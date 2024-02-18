
var map;
let lat, lng;
let boundaries;
let communityScores;
let infoWindow;

const BAD_COLOUR = "#FF0000"
const AVG_COLOUR = "#3bb4f5"
const GOOD_COLOUR = "#0cf218"

const legendColours = {
  good: {
      name: "Great match",
      color: GOOD_COLOUR,
  },
  avg: {
      name: "Good match",
      color: AVG_COLOUR,
  },
  bad: {
      name: "Poor match",
      color: BAD_COLOUR,
  },
};

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

    await getMapScores();

    for (const [key, coords] of Object.entries(boundaries)) {
      const colour = scoreToColour(communityScores[key])
      drawPolygon(coords, colour, key)
    }

    createLegend()
  }
}

async function createLegend() {

  const legend = document.getElementById("legend");

  for (const key in legendColours) {
    const type = legendColours[key];
    const name = type.name;
    const color = type.color;
    const div = document.createElement("div");

    div.innerHTML = `<div style="display: flex; align-items: center;"><div style="width: 20px; height: 20px; background-color: ${color}; display: inline-block;"></div> <p style="padding-left: 5px;">${name}</p></div>`;
    legend.appendChild(div);
  }

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(legend);
}

function scoreToColour(score) {
  if (score > 55) {
    return GOOD_COLOUR
  } else if (score < 45) {
    return BAD_COLOUR
  } else {
    return AVG_COLOUR
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
  const res = await fetch('http://127.0.0.1:5000/getCommunityScores?' + queryParams.slice(1)) // Remove leading '&'
  const temp = await res.json()
  communityScores = {}
  for (const [key, value] of Object.entries(temp)) {
    // Split the key by commas
    const keys = key.split(',');

    // Iterate over the split keys and assign the same value to each collapsed key
    for (const collapsedKey of keys) {
      communityScores[collapsedKey] = value;
    }
  }
}

/**
 * 
 * @param {Array<Array<number>>} coords An array of coordinate arrays (2 element inner arrays)
 * @param {String} colour A hex string
 */
const drawPolygon = (coords, colour, communityName) => {
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
    infoWindow.setContent(`<b>${communityName}</b>`)
    infoWindow.setPosition(event.latLng)
    infoWindow.open(map)
  })
  infoWindow = new google.maps.InfoWindow();


}

initMap();

