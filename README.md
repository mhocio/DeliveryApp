# DeliveryApp
A Full Stack application providing a nice interface web page with the possibility of creation several users.
<br>Used for both adding sevral deliveries to the interactive map and displaying the shortest route for multiple items delivery problem. <br>Page remembers the user with the usage of cookies. Users may log back to the page and see their deliveries. All data is stored on the server.
#### [Link to the project documentation](https://docs.google.com/document/d/1drHtQHOnIHabywGUjHAPBm6SAeDFVtBD/edit?fbclid=IwAR1BUkP8TeHHd-gaFw8grjQu_A49lQYMLuI-QvQgt5CaFrvvJ-TCfS9HSFM&pli=1#)


## How to run the project
In order to run the routing image with publishing a container’s port (5000) to the host:
- run the following command in the folder [routing](routing/) : <br> ```docker run -t -i -p 5000:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/mazowieckie-latest.osrm``` <br>
In case you want to increase the limit of points of the trip, add the following flag to the command above: <br>
```--max-tri-size=1000```
- Start the [DeliveryApi.sln](DeliveryApi/DeliveryApi/DeliveryApi.sln) and run the project.

### Information about OSRM and how to initialize the docker image for running the routing service:
- http://project-osrm.org/docs/v5.22.0/api/#general-options
- https://hub.docker.com/r/osrm/osrm-backend

## TODO: 
- [ ] Imlement https://github.com/Project-OSRM/osrm-text-instructions
- [ ] Secure all endpoints
- [ ] Implement heuristic approach to the VRP, ex.: https://developers.google.com/optimization/routing/vrp
- [x] Implement more display information of the route to the user
