// JavaScript source code

const uri = 'api/DeliveryItems';
const uribase = 'api/DeliveryItems/Base';
const uriRoute = 'api/DeliveryItems/Route';
const uriUser = 'api/Users';
let deliveries = [];

var mymap;
var marker;  // tmp marker to click while adding new base or delivery
var isUpdated;

var markersLayer; // deliveries markers
var markersBaseLayer;  // base markers

var polyline = null; // route line

var addMode = false;
var editMode = false;
var addBaseMode = false;

function buttonShowRoute() {
    toDisplay = new Array();

    fetch(uriRoute)
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
            console.log(pointsString);

            fetch('http://127.0.0.1:5000/trip/v1/driving/' + pointsString + '?steps=true', {
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    _displayRouteFromPolyline(data);
                })
                .catch(error => console.error('Unable to fetch OSRM.', error));

        })
        .catch(error => console.error('Unable to get packages to draw route.', error));

    /*
    fetch('http://127.0.0.1:5000/trip/v1/driving/21.0018,52.2277;21.0226,52.2288?steps=true', {
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            _displayRouteFromPolyline(data);
        })*/
}

function clearRoute() {
    if (polyline)
        mymap.removeLayer(polyline);
}

function _displayRouteFromPolyline(data) {
    clearRoute();

    var encoded = data.trips[0].geometry;
    console.log(encoded);
    polyline = L.Polyline.fromEncoded(encoded, { color: '#2A4B7C', clickable: 'true', snakingSpeed: 400, opacity: 0.7, fillOpacity: 0.5});

    mymap.fitBounds(polyline.getBounds());
    polyline.addTo(mymap).snakeIn();
}

function _displayRoute(data) {
    console.log(data);

    var test = new Array();

    // create a polyline from an array of LatLng points
    if (data.length > 1) {
        console.log("adding");
        for (i = 0; i < data.length; i++) {
            test.push([data[i].latitude, data[i].longitude]);
        }

        console.log(test);
        clearRoute();

        polyline = L.polyline(test, { color: 'red', clickable: 'true', snakingSpeed: 600 }).addTo(mymap).snakeIn();
    }
}

function buttonAddDelivery() {
    closeAllForms();
    document.getElementById('addForm').style.display = 'block';
    addMode = true;
}

function buttonAddBase() {
    closeAllForms();
    document.getElementById('addBaseForm').style.display = 'block';
    addMode = false;
    addBaseMode = true;
}

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function getBase() {
    fetch(uribase)
        .then(response => response.json())
        .then(data => _displayBase(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addBase() {
    if (!addBaseMode) {
        return;
    }

    const addLat = document.getElementById('add-base-lat');
    const addLong = document.getElementById('add-base-long');

    const item = {
        latitude: addLat.value.trim(),
        longitude: addLong.value.trim()
    };

    fetch(uribase, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getBase();
            addLat.value = '';
            addLong.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));

    if (marker) {
        mymap.removeLayer(marker);
    }
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
            //closeAddBaseForm();
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
    closeAllForms();
    editMode = true;

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

    closeInputEditForm();

    return false;
}

/* Closing forms
 * */
function closeInputEditForm() {
    document.getElementById('editForm').style.display = 'none';
    isUpdated = false;
    if (marker) {
        mymap.removeLayer(marker);
    }

    /*addMode = true;*/
    editMode = false;
}

function closeAddBaseForm() {
    document.getElementById('addBaseForm').style.display = 'none';
    isUpdated = false;
    if (marker) {
        mymap.removeLayer(marker);
    }
    addBaseMode = false;
    editMode = false;
}

function closeAddPackageForm() {
    document.getElementById('addForm').style.display = 'none';
    isUpdated = false;
    if (marker) {
        mymap.removeLayer(marker);
    }
    addMode = false;
    editMode = false;
}

function closeAllForms() {
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('addBaseForm').style.display = 'none';
    document.getElementById('editForm').style.display = 'none';
    if (marker) {
        mymap.removeLayer(marker);
    }
    addBaseMode = false;
    addMode = false;
    editMode = false;
}

/* Closing forms
 * */

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'delivery' : 'deliveries';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayBase(data) {

    clearRoute();
    markersBaseLayer.clearLayers();

    data.forEach(item => {

        var markerBase = L.marker([item.latitude, item.longitude],
            {
                title: "Base"
                    + "\n" + parseFloat(item.latitude).toFixed(4)
                    + "\n" + parseFloat(item.longitude).toFixed(4),
                icon: redIcon
            }).addTo(mymap);

        markerBase.on('click', markerOnClick).addTo(mymap);
        markerBase.bindPopup("Base" +
            + "\n" + parseFloat(item.latitude).toFixed(4)
            + "\n" + parseFloat(item.longitude).toFixed(4));

        markerBase.addTo(markersBaseLayer);
    });
}

function _displayItems(data) {
    clearRoute();

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
                title: "name: " + item.name
                    + "\n" + parseFloat(item.latitude).toFixed(4)
                    + "\n" + parseFloat(item.longitude).toFixed(4)
            });

        marker.on('mouseover', function () {
            marker.openPopup();
        });

        var div_element = document.createElement("div");

        var p_element = document.createElement("p");
        p_element.innerHTML += item.name;
        var br_element = document.createElement("br");
        p_element.appendChild(br_element);
        p_element.innerHTML += parseFloat(item.latitude).toFixed(4) + " " + parseFloat(item.longitude).toFixed(4);
        div_element.appendChild(p_element)

        let deleteButtonFromPopup = document.createElement("button");
        deleteButtonFromPopup.innerText = 'Delete Item';
        deleteButtonFromPopup.setAttribute('onclick', `deleteItem(${item.id})`);
        div_element.appendChild(deleteButtonFromPopup);

        marker.bindPopup(div_element);

        marker.addTo(markersLayer);

    });

    deliveries = data;
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

    if (addMode || editMode)
        marker = L.marker([latleng.lat, latleng.lng],
            {
                bounceOnAdd: true,
                bounceOnAddOptions: { duration: 500, height: 20, loop: 1 },
                bounceOnAddCallback: function () { console.log("done"); },
                icon: greenIcon
            }).addTo(mymap);

    if (addBaseMode) {
        marker = L.marker([latleng.lat, latleng.lng],
            {
                bounceOnAdd: true,
                bounceOnAddOptions: { duration: 500, height: 20, loop: 1 },
                bounceOnAddCallback: function () { console.log("done"); },
                icon: redIcon
            }).addTo(mymap);
    }

    if (addMode) {
        document.getElementById("add-lat").value = latleng.lat;
        document.getElementById("add-long").value = latleng.lng;
    }
    else if (editMode) {
        document.getElementById("edit-lat").value = latleng.lat;
        document.getElementById("edit-long").value = latleng.lng;
    }
    else if (addBaseMode) {
        document.getElementById("add-base-lat").value = latleng.lat;
        document.getElementById("add-base-long").value = latleng.lng;
    }

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
    markersBaseLayer = L.layerGroup().addTo(mymap);

    //const GeoSearch = withLeaflet(Search);

    //GeoSearch.addTo(mymap);

    L.control.scale().addTo(mymap);
}

function logInPress() {
    var id01 = document.getElementById('id01');
    if (id01.style.display == 'none')
        id01.style.display = 'inline';
    else
        id01.style.display = 'none';
}

function signUpPress() {
    var id02 = document.getElementById('id02');
    if (id02.style.display == 'none')
        id02.style.display = 'inline';
    else
        id02.style.display = 'none';
}

function logOutPress() {
    var login = document.getElementById('login');
    login.style.display = 'inline';
    var signup = document.getElementById('signup');
    signup.style.display = 'inline';
    var logout = document.getElementById('logout');
    logout.style.display = 'none';
    var user = document.getElementById('user');
    user.style.display = 'none';
    user.innerText = '';
    currentUser = '';
}

function signUp() {
    const addUname = document.getElementById('uname_s');
    const addPsw = document.getElementById('psw_s');

    const item = {
        username: addUname.value.trim(),
        password: addPsw.value.trim()
    };

    fetch(uriUser, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            currentUser = addUname.value.trim();
            var user = document.getElementById('user');
            user.style.display = 'inline';
            user.textContent = currentUser;
        })
        .catch(error => console.error('Unable to add item.', error));

    var id01 = document.getElementById('id01');
    id01.style.display = 'none';
    var id02 = document.getElementById('id02');
    id02.style.display = 'none';
    var login = document.getElementById('login');
    login.style.display = 'none';
    var signup = document.getElementById('signup');
    signup.style.display = 'none';
    var logout = document.getElementById('logout');
    logout.style.display = 'inline';
}

function logIn() {
    const logUname = document.getElementById('uname');
    const logPsw = document.getElementById('psw');

    var urilog = uriUser + "/byUser/" + logUname.value.trim() + "/" + logPsw.value.trim();

    fetch(urilog)
        .then(response => response.json())
        .then(() => {
            currentUser = logUname.value.trim();
            var user = document.getElementById('user');
            user.style.display = 'inline';
            user.textContent = currentUser;
        })
        .catch(error => console.error('Unable to get item.', error));

    var id01 = document.getElementById('id01');
    id01.style.display = 'none';
    var id02 = document.getElementById('id02');
    id02.style.display = 'none';
    var login = document.getElementById('login');
    login.style.display = 'none';
    var signup = document.getElementById('signup');
    signup.style.display = 'none';
    var logout = document.getElementById('logout');
    logout.style.display = 'inline';
}

document.addEventListener("DOMContentLoaded", loadMap, false);