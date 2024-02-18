var map;
let lat, lng;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (geolocation) => {
            [lat, lng] = [geolocation.coords.latitude, geolocation.coords.longitude]

            map = await new Map(document.getElementById("map"), {
                center: { lat: lat, lng: lng },
                zoom: 5,
            })
        })
    }
}

/**
 * 
 * @param {Array<Array<number>>} coords An array of coordinate arrays (2 element inner arrays)
 * @param {String} colour A hex string
 */
const drawPolygon = (coords, colour) => {
    let res = coords.map((point) => {
        return { lat: point[0], lng: point[1] }
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
