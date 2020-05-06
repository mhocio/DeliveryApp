# DeliveryApp
A Full Stack application providing a nice interface web page with the possibility of creation several users.
 <br>Used for both adding sevral deliveries to the interactive map and displaying the shortest route for multiple items delivery problem. <br>Page remembers the user with the usage of cookies. Users may log back to the page and see their deliveries. All data is stored on the server.

 Vehicle Routing Problem *VRP* is an algorithmic problem, whose main idea is to find the best possible route through multiple points. Unlike in graph theory, points on a map cannot usually be connected by just a straight line, the path from point A to point B may be very convoluted.


#### [Link to the project documentation](https://docs.google.com/document/d/1drHtQHOnIHabywGUjHAPBm6SAeDFVtBD/edit?fbclid=IwAR1BUkP8TeHHd-gaFw8grjQu_A49lQYMLuI-QvQgt5CaFrvvJ-TCfS9HSFM&pli=1#)


## How to test the project locally
Tested on Ubuntu 18.04.4 LTS and MacOS.

In order to run the project you need to have:
- .NET Core installed - https://docs.microsoft.com/pl-pl/dotnet/core/install/linux-package-manager-ubuntu-1910 for Ubuntu
- Docker installed - For Ubuntu you may install it using a simple command: 
    ```sh
    $ sudo apt install docker.io
    ```
    If you have run into a problem running docker image with an error: `Got permission denied while trying to connect to the Docker daemon socket`, you may want to visit https://www.digitalocean.com/community/questions/how-to-fix-docker-got-permission-denied-while-trying-to-connect-to-the-docker-daemon-socket and the follow this advice: `$ sudo chmod 666 /var/run/docker.sock`

### Using command line
- Run the Docker routing image and map the port 5000 of your host to port 5000 of the Docker in the folder [routing](routing/):
    ```sh
  $ cd routing
  $ docker run -t -i -p 5000:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/mazowieckie-latest.osrm
  ```
- Start the local server by running the applicaion on any port (in the example used 5055 port - do not use port 5000 since it is required for the Docker image):
    ```sh
    $ cd DeliveryApi/DeliveryApi/
    $ dotnet run --urls="http://localhost:5055"
    ```
- Open the application on `http://localhost:5055` (or other port you had specified) in your browser.

### Using Visual Studio or Visual Studio for Mac
- Run the Docker routing image and map the port 5000 of your host to port 5000 of the Docker in the folder [routing](routing/):
    ```sh
  $ cd routing
  $ docker run -t -i -p 5000:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/mazowieckie-latest.osrm
  ```
- Start the [DeliveryApi.csproj.user](DeliveryApi/DeliveryApi/DeliveryApi.csproj.user) and start the application
- Open the application on `localhost` in your browser.

## Information about OSRM and how to initialize the docker image for running the routing service:
- http://project-osrm.org/docs/v5.22.0/api/#general-options
- https://hub.docker.com/r/osrm/osrm-backend

## TODO:
- https://github.com/Project-OSRM/osrm-text-instructions
- Secure all endpoints
- Implement heuristic approach to the VRP https://developers.google.com/optimization/routing/vrp
- Implement more display information of the route to the user
