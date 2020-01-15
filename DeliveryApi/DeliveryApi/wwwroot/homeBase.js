var markersBaseLayer; // base markers

function getBase() {
    var ending = "";
    if (currentUser != '')
        ending = "/User/" + currentUser

    fetch(uribase + ending)
        .then(response => response.json())
        .then(data => _displayBase(data))
        .catch(error => {
            console.error("Unable to get items.", error);
            markersBaseLayer.clearLayers();
        });
}

function addBase() {
    if (!addBaseMode) {
        return;
    }

    const addLat = document.getElementById("add-base-lat");
    const addLong = document.getElementById("add-base-long");

    const item = {
        latitude: addLat.value.trim(),
        longitude: addLong.value.trim(),
        username: currentUser
    };

    fetch(uribase + "/" + currentUser, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getBase();
            addLat.value = "";
            addLong.value = "";
        })
        .catch(error => console.error("Unable to add item.", error));

    if (marker) {
        mymap.removeLayer(marker);
    }
}

function _displayBase(data) {
    clearRoute();
    markersBaseLayer.clearLayers();

    if (Array.isArray(data))
        data = data[0]

    if (data == null)
        return;

    var markerBase = L.marker([data.latitude, data.longitude], {
        title:
            "Base" +
            "\n" +
            parseFloat(data.latitude).toFixed(4) +
            "\n" +
            parseFloat(data.longitude).toFixed(4),
        icon: redIcon
    }).addTo(mymap);

    markerBase.on("click", markerOnClick).addTo(mymap);
    markerBase.bindPopup(
        "Base" +
        +"\n" +
        parseFloat(data.latitude).toFixed(4) +
        "\n" +
        parseFloat(data.longitude).toFixed(4)
    );

    markerBase.addTo(markersBaseLayer);
}
