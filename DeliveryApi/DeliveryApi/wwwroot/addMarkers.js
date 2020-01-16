function addBaseMarker(lat, lng) {
    if (lat != 0 && lng != 0) {
        marker = L.marker([lat, lng], {
            bounceOnAdd: true,
            bounceOnAddOptions: { duration: bounceDuration, height: bounceHeight, loop: 1 },
            icon: redIcon,
            draggable: true
        }).addTo(mymap).openPopup();


        marker.on('dragend', function(event) {
            var position = marker.getLatLng();
        
            marker.setLatLng(position, {
              draggable: 'true'
            }).bindPopup(position).update();
        
            if (addBaseMode) {
                document.getElementById("add-base-lat").value = parseFloat(position.lat).toFixed(6);
                document.getElementById("add-base-long").value = parseFloat(position.lng).toFixed(6);
            }
          });
    }
}

function addNewItemMarker(lat, lng) {
    if (lat != 0 && lng != 0) {
        marker = L.marker([lat, lng], {
            bounceOnAdd: true,
            bounceOnAddOptions: { duration: bounceDuration, height: bounceHeight, loop: 1 },
            icon: greenIcon,
            draggable: true
        }).addTo(mymap).openPopup();

        marker.openPopup();

        marker.on('dragend', function(event) {
            var position = marker.getLatLng();
        
            marker.setLatLng(position, {
              draggable: 'true'
            }).bindPopup(position).update();

            console.log("drag end");
            console.log(position);
        
            if (addMode) {
                document.getElementById("add-lat").value = parseFloat(position.lat).toFixed(6);
                document.getElementById("add-long").value = parseFloat(position.lng).toFixed(6);
            } else if (editMode) {
                document.getElementById("edit-lat").value = parseFloat(position.lat).toFixed(6);
                document.getElementById("edit-long").value = parseFloat(position.lng).toFixed(6);
            }
          });
    }
}