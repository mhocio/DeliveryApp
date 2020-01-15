var markersBaseLayer; // base markers

function getBase() {
    fetch(uribase)
        .then(response => response.json())
        .then(data => _displayBase(data))
        .catch(error => console.error("Unable to get items.", error));
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

    data.forEach(item => {
        var markerBase = L.marker([item.latitude, item.longitude], {
            title:
                "Base" +
                "\n" +
                parseFloat(item.latitude).toFixed(4) +
                "\n" +
                parseFloat(item.longitude).toFixed(4),
            icon: redIcon
        }).addTo(mymap);

        markerBase.on("click", markerOnClick).addTo(mymap);
        markerBase.bindPopup(
            "Base" +
            +"\n" +
            parseFloat(item.latitude).toFixed(4) +
            "\n" +
            parseFloat(item.longitude).toFixed(4)
        );

        markerBase.addTo(markersBaseLayer);
    });
}