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
    closeAllForms();
    editMode = true;

    var item = deliveries.find(item => item.id === id);

    var points = markersLayer._layers;
    var pointItemMarker;
    Object.keys(points).forEach(function(key) {
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
    const name = itemCount === 1 ? "delivery" : "deliveries";

    document.getElementById("counter").innerText = `${itemCount} ${name}`;
}

function justDisplayItems(data) {
    clearRoute();

    const tBody = document.getElementById("deliveries");
    tBody.innerHTML = "";

    _displayCount(data.length);

    if (data.length) {
        document.getElementById("tableDeliveries").style.display = "table";
    } else {
        document.getElementById("tableDeliveries").style.display = "none";
    }

    const button = document.createElement("button");

    markersLayer.clearLayers();

    data.forEach(item => {
        let editButton = button.cloneNode(false);
        editButton.innerText = "Edit";
        editButton.setAttribute("onclick", `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = "Delete";
        deleteButton.setAttribute("onclick", `deleteItem(${item.id})`);

        let saveButton = button.cloneNode(false);
        saveButton.innerText = "Save to Account";
        saveButton.setAttribute("onclick", `saveItem(${item.id})`);

        let excludeButton = button.cloneNode(false);
        excludeButton.innerText = "Exclude from Route";
        excludeButton.setAttribute("onclick", `excludeItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let nameNode = document.createTextNode(item.name);
        td1.appendChild(nameNode);

        let td2 = tr.insertCell(1);
        let latNode = document.createTextNode(item.latitude);
        td2.appendChild(latNode);

        let td3 = tr.insertCell(2);
        let longNode = document.createTextNode(item.longitude);
        td3.appendChild(longNode);

        let td4 = tr.insertCell(3);
        let sizeNode = document.createTextNode(item.size);
        td4.appendChild(sizeNode);

        let td5 = tr.insertCell(4);
        td5.appendChild(editButton);

        let td6 = tr.insertCell(5);
        td6.appendChild(deleteButton);

        let td7 = tr.insertCell(6);
        td7.appendChild(saveButton);

        let td8 = tr.insertCell(7);
        td8.appendChild(excludeButton);

        let td9 = tr.insertCell(8);
        let userNode = document.createTextNode(item.username);
        td9.appendChild(userNode);

        var marker = L.marker([item.latitude, item.longitude], {
            title:
                "name: " +
                item.name +
                "\n" +
                parseFloat(item.latitude).toFixed(4) +
                "\n" +
                parseFloat(item.longitude).toFixed(4),
            draggable: true
        });

        marker.on("mouseover", function () {
            marker.openPopup();
        });

        var div_element = document.createElement("div");

        var p_element = document.createElement("p");
        p_element.innerHTML += item.name;
        var br_element = document.createElement("br");
        p_element.appendChild(br_element);
        p_element.innerHTML +=
            parseFloat(item.latitude).toFixed(4) +
            " " +
            parseFloat(item.longitude).toFixed(4);
        div_element.appendChild(p_element);

        let deleteButtonFromPopup = document.createElement("button");
        deleteButtonFromPopup.innerText = "Delete Item";
        deleteButtonFromPopup.setAttribute("onclick", `deleteItem(${item.id})`);
        div_element.appendChild(deleteButtonFromPopup);

        marker.bindPopup(div_element);

        marker.addTo(markersLayer);
    });

    toRoute = deliveries;
}

function clearTable() {
    const tBody = document.getElementById("deliveries");
    tBody.innerHTML = "";
    document.getElementById("tableDeliveries").style.display = "none";
    markersLayer.clearLayers();
    toRoute = [];
}

function showAll() {
    justDisplayItems(deliveries);
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
    mymap = L.map("mapid").setView([52.229, 21.011], 14);

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

    currentUser = '';

    document.addEventListener('keyup', function (event) {
        if (event.defaultPrevented) {
            return;
        }
    
        var key = event.key || event.keyCode;
        if (key === 'Escape' || key === 'Esc' || key === 27) {
            console.log("click ESC");
            closeOverlay();
        }
    });

    overlay = document.getElementById('overlay');
    overlay.addEventListener('click', function (event) {

        if (event.target.querySelector('.overlay-inner') != null) {
            closeOverlay();
        }
    });
}

document.addEventListener("DOMContentLoaded", loadMap, false);