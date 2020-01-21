// JavaScript source code

const uri = "api/DeliveryItems";
const uriUser = "api/Users";
const uribase = "api/DeliveryItems/Base";
let deliveries = [];

var mymap;
var marker; // tmp marker to click while adding new base or delivery

var markersLayer; // deliveries markers
var removedMarker = null;

var addMode = false;
var editMode = false;
var addBaseMode = false;

const bounceHeight = 30;
const bounceDuration = 350;


function buttonAddDelivery() {
    closeEditForm();
    addBaseMode = false;

    var lat = document.getElementById("add-lat").value;
    var lng = document.getElementById("add-long").value;
    addNewItemMarker(lat, lng);

    if (addMode == false) {
        addMode = true;
    } else {
        closeAllForms();
    }
}

function buttonAddBase() {
    closeEditForm();
    addMode = false;

    var lat = document.getElementById("add-base-lat").value;
    var lng = document.getElementById("add-base-long").value;
    addBaseMarker(lat, lng);

    if (!addBaseMode) {
        addBaseMode = true;
    } else {
        closeAllForms();
    }
}

function displayEditForm(id) {
    var itemO = deliveries.find(item => item.id === id);
    if (itemO.username == currentUser) {

        closeAllForms();
        editMode = true;

        var item = deliveries.find(item => item.id === id);

        var points = markersLayer._layers;
        var pointItemMarker;
        Object.keys(points).forEach(function (key) {
            console.log(points[key]);
            if (points[key].options.id === id)
                pointItemMarker = points[key];
        });

        removedMarker = pointItemMarker;
        markersLayer.removeLayer(pointItemMarker);


        document.getElementById("edit-name").value = item.name;
        document.getElementById("edit-lat").value = parseFloat(item.latitude).toFixed(6);
        document.getElementById("edit-long").value = parseFloat(item.longitude).toFixed(6);
        document.getElementById("edit-size").value = item.size;
        document.getElementById("edit-id").value = item.id;
        document.getElementById("editForm").style.display = "block";

        if (marker) {
            mymap.removeLayer(marker);
        }
        addNewItemMarker(item.latitude, item.longitude);

    }
    else {
        const myNotification = window.createNotification({
            theme: "error",
            closeOnClick: true,
            displayCloseButton: true,
        });
        myNotification({
            message: "Not authorized to edit!",
            title: "Edit error"
        });
    }
}

function closeEditForm() {
    if (marker)
            mymap.removeLayer(marker);
    editMode = false;
    document.getElementById("editForm").style.display = "none";

    if (removedMarker) {
        removedMarker.addTo(markersLayer);
        removedMarker = null;
    }
}

function closeAllForms() {
    $('.panel-collapse')
        .collapse('hide');

    if (marker)
        mymap.removeLayer(marker);

    if (removedMarker) {
        removedMarker.addTo(markersLayer);
        removedMarker = null;
    }

    addBaseMode = false;
    addMode = false;
    editMode = false;
    
    document.getElementById("editForm").style.display = "none";
}

function _displayCount(itemCount) {
    //const name = itemCount === 1 ? "delivery" : "deliveries";
    //document.getElementById("counter").innerText = `${itemCount} ${name}`;
    document.getElementById("counter").innerText = itemCount;
}

function clearTable() {
    const tBody = document.getElementById("deliveries");
    tBody.innerHTML = "";
    document.getElementById("tableDeliveries").style.display = "none";
    markersLayer.clearLayers();
    toRoute = [];
}


function markerOnClick(e) {
    //alert("hi. you clicked the marker at " + e.latlng);
    marker.openPopup();
}

function onMapClick(e) {
    var latleng = e.latlng;

    if (addMode) {
        document.getElementById("add-lat").value = parseFloat(latleng.lat).toFixed(6);
        document.getElementById("add-long").value = parseFloat(latleng.lng).toFixed(6);
    } else if (editMode) {
        document.getElementById("edit-lat").value = parseFloat(latleng.lat).toFixed(6);
        document.getElementById("edit-long").value = parseFloat(latleng.lng).toFixed(6);
    } else if (addBaseMode) {
        document.getElementById("add-base-lat").value = parseFloat(latleng.lat).toFixed(6);
        document.getElementById("add-base-long").value = parseFloat(latleng.lng).toFixed(6);
    }

    if (marker)
        mymap.removeLayer(marker);

    if (addMode || editMode)
        addNewItemMarker(latleng.lat, latleng.lng);

    if (addBaseMode)
        addBaseMarker(latleng.lat, latleng.lng);
}

function loadMap() {
    mymap = L.map("mapid", {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView([52.229, 21.011], 14);

    L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
        {
            maxZoom: 18,
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery � <a href="https://www.mapbox.com/">Mapbox</a>',
            id: "mapbox.streets"
        }
    ).addTo(mymap);

    mymap.on("click", onMapClick);

    markersLayer = L.layerGroup().addTo(mymap);
    markersBaseLayer = L.layerGroup().addTo(mymap);

    L.control.scale().addTo(mymap);
}

function ThrowLogo() {
    const element = document.getElementById("FakeLogo");
    console.log("click logo");
    element.classList.add("animate");
    element.classList.add("hinge");

    element.addEventListener('animationend', function() 
    { 
        document.getElementById("FakeLogo").style.display = "none"; 
    })
}

function loadPage() {
    loadMap();
    getBase();
    getItems();

    currentUser = '';

    document.addEventListener('keyup', function (event) {
        if (event.defaultPrevented) {
            return;
        }
    
        var key = event.key || event.keyCode;
        if (key === 'Escape' || key === 'Esc' || key === 27) {
            console.log("click ESC");
            closeOverlay_login();
            closeOverlay_register();
        }
    });

    function validatePassword() {
        if(password.value != confirm_password.value) {
            confirm_password.setCustomValidity("Passwords Don't Match");
        } else {
            confirm_password.setCustomValidity('');
        }
    }

    var password = document.getElementById("psw_s")
    var confirm_password = document.getElementById("psw_s_repeat");

    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;

    var overlay_login = document.getElementById('overlay-login');
    overlay_login.addEventListener('click', function (event) {

        if (event.target.querySelector('.overlay-inner') != null) {
            closeOverlay_login();
        }
    });

    var overlay_register = document.getElementById('overlay-register');
    overlay_register.addEventListener('click', function (event) {

        if (event.target.querySelector('.overlay-inner') != null) {
            closeOverlay_register();
        }
    });

      $('[data-toggle="tooltip"]').tooltip();
}

document.addEventListener("DOMContentLoaded", loadPage, false);