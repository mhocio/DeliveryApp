var polyline = null; // route line
// const uriRoute2 = "api/DeliveryItems/Routes2"; // old version calculating on user side
const uriRouteSeveral = "api/DeliveryItems/Route/Several/";
var PolylinesSeveral = [];
var colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', 
'#f032e6', '#bcf60c', '#008080', '#9a6324', '#800000', 
'#808000', '#000075', '#808080']

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function buttonShowRoute2() {
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
            console.log(data);
            _displayRouteFromPolyline(data);
        })
        .catch(error =>
            console.error("Unable to to draw route.", error)
        );
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

function buttonShowRoute() {

    fetch(uriRouteSeveral + "2")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            _displayRoutesFromPolylinesSeveral(data);
        })
        .catch(error =>
            console.error("Unable to to draw several routes.", error)
        );
}

function clearRouteSeveral() {
    for (i = 0; i < PolylinesSeveral.length; i++) { 
        mymap.removeLayer(PolylinesSeveral[i]);
    }
    PolylinesSeveral = [];
}

function _displayRoutesFromPolylinesSeveral(data) {
    clearRouteSeveral();
    shuffle(colors);
    let i = 0;
    var bounds = L.bounds();

    data.forEach(element => {
        var encoded = element;
        var new_polyline = L.Polyline.fromEncoded(encoded, {
            color: colors[i % colors.length],
            clickable: "true",
            snakingSpeed: 400,
            opacity: 1,
            fillOpacity: 0.5
        });
    
        if (i == 0)
            bounds = new_polyline.getBounds();
        i++;
        PolylinesSeveral.push(new_polyline);
    });

    fetch(uri)
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                bounds.extend([element.latitude, element.longitude]);
            })
        })
        .catch(error => console.error("Unable to get items.", error));

    mymap.fitBounds(bounds, easeLinearity = 1);

    PolylinesSeveral.forEach(element => {
        element.addTo(mymap).snakeIn();
    })
}