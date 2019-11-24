// JavaScript source code

const uri = 'api/DeliveryItems';
let deliveries = [];

var mymap;
var marker;
var isUpdated;
var markersLayer;

var addMode;

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    if (!addMode) {
        return;
    }
    const addName = document.getElementById('add-name');
    const addLat = document.getElementById('add-lat');
    const addLong = document.getElementById('add-long');
    const addSize = document.getElementById('add-size');

    const item = {
        name: addName.value.trim(),
        latitude: addLat.value.trim(),
        longitude: addLong.value.trim(),
        size: addSize.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addName.value = '';
            addLat.value = '';
            addLong.value = '';
            addSize.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));

    if (marker) {
        mymap.removeLayer(marker);
    }
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    addMode = false;

    const item = deliveries.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-lat').value = item.latitude;
    document.getElementById('edit-long').value = item.longitude;
    document.getElementById('edit-size').value = item.size;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('editForm').style.display = 'block';

    if (marker) {
        mymap.removeLayer(marker);
    }
    marker = L.marker([item.latitude, item.longitude]).addTo(mymap);
    isUpdated = true;
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        name: document.getElementById('edit-name').value.trim(),
        latitude: document.getElementById('edit-lat').value.trim(),
        longitude: document.getElementById('edit-long').value.trim(),
        size: document.getElementById('edit-size').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
    isUpdated = false;
    if (marker) {
        mymap.removeLayer(marker);
    }
    addMode = true;
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'delivery' : 'deliveries';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('deliveries');
    tBody.innerHTML = '';

    _displayCount(data.length);

    if (data.length) {
        document.getElementById("tableDeliveries").style.display = 'table';
    } else {
        document.getElementById("tableDeliveries").style.display = 'none';
    }

    const button = document.createElement('button');

    markersLayer.clearLayers();

    data.forEach(item => {

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

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


        var marker = L.marker([item.latitude, item.longitude],
            {
                title: item.name
                    + "\n" + parseFloat(item.latitude).toFixed(4)
                    + "\n" + parseFloat(item.longitude).toFixed(4)
            });
        marker.on('mouseover', function () {
            marker.openPopup();
        });
        marker.addTo(markersLayer);
    });

    deliveries = data;
}

var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function onMapClick(e) {
    var latleng = e.latlng;

    if (!isUpdated) {
        document.getElementById("add-lat").value = latleng.lat;
        document.getElementById("add-long").value = latleng.lng;
    }
    else {
        document.getElementById("edit-lat").value = latleng.lat;
        document.getElementById("edit-long").value = latleng.lng;
    }

    if (marker) {
        mymap.removeLayer(marker);
    }

    marker = L.marker([latleng.lat, latleng.lng],
        {
            bounceOnAdd: true,
            bounceOnAddOptions: { duration: 5000, height: 100, loop: 2 },
            bounceOnAddCallback: function () { console.log("done"); },
            icon: greenIcon
        }).addTo(mymap);
}

function loadMap() {
    mymap = L.map('mapid').setView([52.229, 21.011], 14);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery � <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

    mymap.on('click', onMapClick);
    isUpdated = false;

    markersLayer = L.layerGroup().addTo(mymap);

    addMode = true;

    const GeoSearch = withLeaflet(Search)

    GeoSearch.addTo(mymap);
}

document.addEventListener("DOMContentLoaded", loadMap, false);