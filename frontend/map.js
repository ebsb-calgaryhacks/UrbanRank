
var map;
let lat, lng;
let boundaries;

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

/**
 * 
 * @param {Array<Array<number>>} coords An array of coordinate arrays (2 element inner arrays)
 * @param {String} colour A hex string
 */
const drawPolygon = (coords, colour) => {
  let res = coords.map((point) => {
    const lat = Number(point[1])
    const lng = Number(point[0])

    return {
      lat: isNaN(lat) ? 0 : lat,
      lng: isNaN(lng) ? 0 : lng
    }
  })

  console.log(res);



  const polygon = new google.maps.Polygon({
    path: res,
    strokeColor: colour,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: colour,
    fillOpacity: 0.35,
  })


  polygon.setMap(map);


}

initMap();

