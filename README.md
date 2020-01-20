# DeliveryApp
A full stack application providing nice interface for displaying the shortest route for multiple items delivery problem.


## How to run the project
In order to run the routing image go to folder routing and paste:
- ```docker run -t -i -p 5000:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/mazowieckie-latest.osrm```
- Run the DeliveryApi.sln and start the project

Information about OSRM and how to initialize the docker image for running the routing service:
- http://project-osrm.org/docs/v5.22.0/api/#general-options
- https://hub.docker.com/r/osrm/osrm-backend

### TODO: 
- https://github.com/Project-OSRM/osrm-text-instructions
- secure all endpoints
- Implement heuristic approach to the VRP https://developers.google.com/optimization/routing/vrp
