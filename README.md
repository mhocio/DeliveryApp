# DeliveryApp
A full stack application providing nice interface for displaying the shortest route for multiple items delivery problem.


## How to run the project
In order to run the routing image with publishing a container’s port (5000) to the host:
- run the following command in the folder [routing](routing/) :
- ```docker run -t -i -p 5000:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/mazowieckie-latest.osrm```
- Run the ```DeliveryApi.sln``` [DeliveryApi.sln](DeliveryApi/DeliveryApi/DeliveryApi.sln) and start the project

### Information about OSRM and how to initialize the docker image for running the routing service:
- http://project-osrm.org/docs/v5.22.0/api/#general-options
- https://hub.docker.com/r/osrm/osrm-backend

### TODO: 
- https://github.com/Project-OSRM/osrm-text-instructions
- Secure all endpoints
- Implement heuristic approach to the VRP https://developers.google.com/optimization/routing/vrp
- Implement more display information of the route to the user
