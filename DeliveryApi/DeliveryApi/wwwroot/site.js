﻿// JavaScript source code

const uri = "api/DeliveryItems";
const uriUser = "api/Users";
const uribase = "api/DeliveryItems/Base";
let deliveries = [];

var mymap;
var marker; // tmp marker to click while adding new base or delivery

var markersLayer; // deliveries markers

var addMode = false;
var editMode = false;
var addBaseMode = false;


function hideButtons() {
    document.getElementById("addDeliveryButton").style.display = "none";
    document.getElementById("addBaseButton").style.display = "none";
}

function buttonAddDelivery() {
    closeAllForms();
    document.getElementById("addForm").style.display = "block";
    addMode = true;

    hideButtons();
}

function buttonAddBase() {
    closeAllForms();
    document.getElementById("addBaseForm").style.display = "block";
    addMode = false;
    addBaseMode = true;

    hideButtons();
}

function displayEditForm(id) {
    closeAllForms();
    editMode = true;

    const item = deliveries.find(item => item.id === id);

    document.getElementById("edit-name").value = item.name;
    document.getElementById("edit-lat").value = parseFloat(item.latitude).toFixed(6);
    document.getElementById("edit-long").value = parseFloat(item.longitude).toFixed(6);
    document.getElementById("edit-size").value = item.size;
    document.getElementById("edit-id").value = item.id;
    document.getElementById("editForm").style.display = "block";

    if (marker) {
        mymap.removeLayer(marker);
    }
    marker = L.marker([item.latitude, item.longitude]).addTo(mymap);
}

function closeAllForms() {
    document.getElementById("addForm").style.display = "none";
    document.getElementById("addBaseForm").style.display = "none";
    document.getElementById("editForm").style.display = "none";
    if (marker) {
        mymap.removeLayer(marker);
    }
    addBaseMode = false;
    addMode = false;
    editMode = false;

    document.getElementById("addDeliveryButton").style.display = "block";
    document.getElementById("addBaseButton").style.display = "block";
}

function _displayCount(itemCount) {
    const name = itemCount === 1 ? "delivery" : "deliveries";

    document.getElementById("counter").innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
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
        let latNode = document.createTextNode(parseFloat(item.latitude).toFixed(6));
        td2.appendChild(latNode);

        let td3 = tr.insertCell(2);
        let longNode = document.createTextNode(parseFloat(item.longitude).toFixed(6));
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

    deliveries = data;
    toRoute = deliveries;
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

    if (marker) {
        mymap.removeLayer(marker);
    }

    let bounceHeight = 30;
    let bounceDuration = 350;

    if (addMode || editMode)
        marker = L.marker([latleng.lat, latleng.lng], {
            bounceOnAdd: true,
            bounceOnAddOptions: { duration: bounceDuration, height: bounceHeight, loop: 1 },
            icon: greenIcon,
            draggable: true
        }).addTo(mymap);

    if (addBaseMode) {
        marker = L.marker([latleng.lat, latleng.lng], {
            bounceOnAdd: true,
            bounceOnAddOptions: { duration: bounceDuration, height: bounceHeight, loop: 1 },
            icon: redIcon,
            draggable: true
        }).addTo(mymap);
    }

    if (addMode) {
        document.getElementById("add-lat").value = latleng.lat;
        document.getElementById("add-long").value = latleng.lng;
    } else if (editMode) {
        document.getElementById("edit-lat").value = latleng.lat;
        document.getElementById("edit-long").value = latleng.lng;
    } else if (addBaseMode) {
        document.getElementById("add-base-lat").value = latleng.lat;
        document.getElementById("add-base-long").value = latleng.lng;
    }
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
}

document.addEventListener("DOMContentLoaded", loadMap, false);