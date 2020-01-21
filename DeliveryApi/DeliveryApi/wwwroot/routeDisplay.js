var polyline = null; // route line
// const uriRoute2 = "api/DeliveryItems/Routes2"; // old version calculating on user side
const uriRoute = "api/DeliveryItems/Route";
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

function buttonShowRoute() {
    toDisplay = new Array();

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

function buttonShowRouteForUser() {
    toDisplay = new Array();

    fetch(uriRoute + "/" + currentUser)
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

    var alert = document.getElementById("routeDisplayedAlert");
    alert.innerHTML = "";
    alert.style.display = "none";
  
    clearRouteSeveral();
}

function _displayRouteFromPolyline(data) {
    clearRoute();

    var encoded = data.trips[0].geometry;
    
    var distance = data.trips[0].distance;
    var distanceMessage = "";
    if (distance > 1000) {
        distanceMessage = "Distance: " + (distance / 1000).toFixed(2) + " km"
    } else {
        distanceMessage = "Distance: " + distance + " meters"
    }
    
    var duration = data.trips[0].duration;
    var minutes = Math.round(duration / 60);

    //var minutes = Math.floor(duration / 60);
    //var seconds = duration - minutes * 60;

    polyline = L.Polyline.fromEncoded(encoded, {
        color: "#2A4B7C",
        clickable: "true",
        snakingSpeed: 400,
        opacity: 0.7,
        fillOpacity: 0.5
    });

    mymap.fitBounds(polyline.getBounds());
    polyline.addTo(mymap).snakeIn();

    const myNotification = window.createNotification({
        theme: "info",
        closeOnClick: true,
        displayCloseButton: true,
    });
    myNotification({
        message: distanceMessage + "\n" + "Duration: " + minutes + " minutes",
        title: "Route displayed!"
    });

    var alert = document.getElementById("routeDisplayedAlert");
    alert.innerHTML = "<h3>" + "Route displayed" + "</h3>" + distanceMessage + ", Duration: " + minutes + " minutes"
    alert.style.display = "inline";
}

var controller = new AbortController();
var signal = controller.signal;

function abortGetSeveralRoutes() {
    controller.abort();

    const close_loading = document.getElementById("closeGetSeveralRoutesRequest");
    const loading = document.getElementById("getSeveralRoutesLoading");

    close_loading.style.display = "none";
    loading.style.display = "none";

    controller = new AbortController();
    signal = controller.signal;
}

function buttonShowSeveralRoutes() {

    let numberOfRoutes = document.getElementById("number-routes").value;

    const loading = document.getElementById("getSeveralRoutesLoading");
    const close_loading = document.getElementById("closeGetSeveralRoutesRequest");

    loading.style.display = "inline";
    close_loading.style.display = "inline";


    fetch(uriRouteSeveral + numberOfRoutes, {
            signal: signal,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            _displayRoutesFromPolylinesSeveral(data);
            loading.style.display = "none";
            close_loading.style.display = "none";
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
    clearRoute();
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