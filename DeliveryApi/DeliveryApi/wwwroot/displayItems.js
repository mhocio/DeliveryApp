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
        editButton.style = "btn btn-secondary";
        editButton.innerText = "Edit";
        editButton.classList.add("btn");
        editButton.classList.add("btn-secondary");
        editButton.classList.add("btn-sm");
        editButton.setAttribute("onclick", `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = "Delete";
        deleteButton.classList.add("btn");
        deleteButton.classList.add("btn-outline-danger");
        deleteButton.classList.add("btn-sm");
        deleteButton.setAttribute("onclick", `deleteItem(${item.id})`);

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

        var marker = L.marker([item.latitude, item.longitude], {
            title:
                "name: " +
                item.name +
                "\n" +
                parseFloat(item.latitude).toFixed(4) +
                "\n" +
                parseFloat(item.longitude).toFixed(4),
                id: item.id
            //draggable: true
        });

        marker.on("mouseover", function () {
            marker.openPopup();
        });

        var div_element = document.createElement("div");
        div_element.classList.add("text-justify");

        var p_element = document.createElement("div");
        p_element.innerHTML += "Name: " + item.name;
        var br_element = document.createElement("br");
        p_element.appendChild(br_element);
        p_element.innerHTML +=
            parseFloat(item.latitude).toFixed(4) +
            " " +
            parseFloat(item.longitude).toFixed(4);
        div_element.appendChild(p_element);

        let deleteButtonFromPopup = document.createElement("button");
        deleteButtonFromPopup.innerText = "Delete Item";
        deleteButtonFromPopup.classList.add("btn");
        deleteButtonFromPopup.classList.add("btn-danger");
        deleteButtonFromPopup.classList.add("btn-sm");
        deleteButtonFromPopup.classList.add("m-2");
        deleteButtonFromPopup.style.padding = "2px";
        deleteButtonFromPopup.setAttribute("onclick", `deleteItem(${item.id})`);
        div_element.appendChild(deleteButtonFromPopup);

        let editItemButtonFromPopup = document.createElement("button");
        editItemButtonFromPopup.innerText = "Edit Item";
        editItemButtonFromPopup.classList.add("btn");
        editItemButtonFromPopup.classList.add("btn-outline-secondary");
        editItemButtonFromPopup.classList.add("btn-sm");
        editItemButtonFromPopup.style.padding = "2px";
        editItemButtonFromPopup.setAttribute("onclick", `displayEditForm(${item.id})`);
        div_element.appendChild(editItemButtonFromPopup);

        marker.bindPopup(div_element);
        marker.addTo(markersLayer);
    });

    deliveries = data;
    toRoute = deliveries;
}