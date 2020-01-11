# DeliveryApp
In order to run routing image go to folder routing and paste:

```docker run -t -i -p 5000:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/mazowieckie-latest.osrm```

http://project-osrm.org/docs/v5.22.0/api/#general-options
https://hub.docker.com/r/osrm/osrm-backend

Bouncing: https://github.com/maximeh/leaflet.bouncemarker

TODO: 
https://github.com/Project-OSRM/osrm-text-instructions
