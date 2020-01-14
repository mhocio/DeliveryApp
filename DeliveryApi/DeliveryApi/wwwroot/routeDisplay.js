var polyline = null; // route line
// const uriRoute2 = "api/DeliveryItems/Routes2"; // old version calculating on user side

function buttonShowRoute() {
    toDisplay = new Array();

    /*fetch(uriRoute2)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            pointsString = "";
            for (i = 0; i < data.length; i++) {
                pointsString += data[i].longitude.toString();
                pointsString += ",";
                pointsString += data[i].latitude.toString();
                if (i + 1 < data.length) {
                    pointsString += ";";
                }
            }
            console.log("http://127.0.0.1:5000/trip/v1/driving/" + pointsString + "?steps=true");

            fetch(
                "http://127.0.0.1:5000/trip/v1/driving/" + pointsString + "?steps=true",
                {}
            )
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    _displayRouteFromPolyline(data);
                })
                .catch(error => console.error("Unable to fetch OSRM.", error));
        })
        .catch(error =>
            console.error("Unable to get packages to draw route.", error)
        );
        */

    fetch(uriRoute)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            _displayRouteFromPolyline(data);
        })
        .catch(error =>
            console.error("Unable to to draw route.", error)
        );
}

function buttonShowRouteExp() {
    toDisplay = new Array();

    var ids = '';
    toRoute.forEach(item => ids = ids + item.id + ',');
    //alert(ids);

    /*
    fetch(uriRoute)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            _displayRouteFromPolyline(data);
        })
        .catch(error =>
            console.error("Unable to to draw route.", error)
        );*/

    fetch(uriRoute + '/' + ids)
        .then(response => response.json())
        .catch(error =>
            console.error("Unable to to draw route.", error));
        
}

function clearRoute() {
    if (polyline)
        mymap.removeLayer(polyline);
}

function _displayRouteFromPolyline(data) {
    clearRoute();

    var encoded = data.trips[0].geometry;
    //console.log(encoded);
    polyline = L.Polyline.fromEncoded(encoded, {
        color: "#2A4B7C",
        clickable: "true",
        snakingSpeed: 400,
        opacity: 0.7,
        fillOpacity: 0.5
    });

    mymap.fitBounds(polyline.getBounds());
    polyline.addTo(mymap).snakeIn();
}