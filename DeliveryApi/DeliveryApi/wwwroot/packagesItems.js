function getItems() {
    var ending = "";

    if (currentUser != "")
        ending = "/User/" + currentUser;

    fetch(uri + ending)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error("Unable to get items.", error));
}

function addItem() {
    if (!addMode) {
        return;
    }

    const addName = document.getElementById("add-name");
    const addLat = document.getElementById("add-lat");
    const addLong = document.getElementById("add-long");
    const addSize = document.getElementById("add-size");

    const item = {
        name: addName.value.trim(),
        latitude: addLat.value.trim(),
        longitude: addLong.value.trim(),
        size: addSize.value.trim(),
        username: currentUser
    };

    fetch(uri, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addName.value = "";
            addLat.value = "";
            addLong.value = "";
            addSize.value = "";

            const myNotification = window.createNotification({
            });
            myNotification({
                message: item.name + " added!",
                displayCloseButton: true,
            });  

        })
        .catch(error => console.error("Unable to add item.", error));

    if (marker) {
        mymap.removeLayer(marker);
    }
}

function deleteItem(id) {
    fetch(uri + "/" + id)
        .then(response => response.json())
        .then(data => {
            fetch(`${uri}/${id}`, {
                method: "DELETE"
            })
                .then(() => {
                    getItems();
        
                    const myNotification = window.createNotification({
                    });
                    myNotification({
                        message: data.name + " deleted!",
                        displayCloseButton: true,
                    });
                })
                .catch(error => console.error("Unable to delete item.", error));
        })
        .catch(error => console.error("Unable to get item.", error));
}

function updateItem() {
    const itemId = document.getElementById("edit-id").value;
    const item = {
        id: parseInt(itemId, 10),
        name: document.getElementById("edit-name").value.trim(),
        latitude: document.getElementById("edit-lat").value.trim(),
        longitude: document.getElementById("edit-long").value.trim(),
        size: document.getElementById("edit-size").value.trim(),
        username: currentUser
    };

    fetch(`${uri}/${itemId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error("Unable to delete item.", error));

    closeAllForms();

    return false;
}

function saveItem(id) {
    const item = deliveries.find(item => item.id === id);
    if (item.username == '') {
        item.username = currentUser;

        fetch(`${uri}/${item.id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        })
            .then(() => getItems())
            .catch(error => console.error("Unable to delete item.", error));
    }
}

function excludeItem(id) {
    const excluded = toRoute.filter(item => item.id != id);
    toRoute = excluded;
    justDisplayItems(toRoute);
}