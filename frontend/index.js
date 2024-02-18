let map;
let lat, lng;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (geolocation) => {
            [lat, lng] = [geolocation.coords.latitude, geolocation.coords.longitude]
            
            map = new Map(document.getElementById("map"), {
                center: { lat: lat, lng: lng },
                zoom: 14,
            }); 
        })
    }
    

}

initMap();