function startIntro(){
    var intro = introJs();
      intro.setOptions({
        showProgress: true,
        scrollToElement: true,
        overlayOpacity: 0.4,
        disableInteraction: false,
        hidePrev: true,
        scrollToElement: true,
        steps: [
          { 
            intro: "Take few seconds to learn how to use the app :)"
          },
          {
            element: '#step_base',
            intro: "First add a base where you want to start and finish the trip.",
            position: 'top-right'
          },
          {
            element: '#mapid',
            intro: "Click on the map to select the coordinates for the base.",
            position: 'left'
          },
          {
            element: '#collapseTwo',
            intro: "Click Add button to add base.",
          },
          {
            element: '#step_deliveries',
            intro: 'Then add some deliveries!',
            position: 'left'
          },
          {
            element: '#mapid',
            intro: "Click on the map to select the coordinates for the new delivery!",
            position: 'left'
          },
          {
            element: '#collapseOne',
            intro: 'Fill required fields and click Add button to add a new delivery!',
            position: 'left'
          },
          {
            element: '#showRouteButton',
            intro: 'Click Show Route button',
            position: 'auto',
          },
        ]
      });

      $('#accordionAddItem-Base .collapse').collapse('hide');

      intro.onbeforechange(function () {
        if (this._currentStep === 1) {
            setTimeout( function () {
                document.getElementById("addBaseButton").click();
            }, 200);
        } 
        else if (this._currentStep === 3) {
            setTimeout( function () {
                document.getElementById("addBaseButtonClick").focus();
                }, 300);
        }
        else if (this._currentStep === 4) {
            setTimeout( function () {
                document.getElementById("addDeliveryButton").click();
                }, 200);
        }
        else if (this._currentStep === 6) {
            setTimeout( function () {
                document.getElementById("add-name").focus();
                document.getElementById("add-size").focus();
                document.getElementById("AddItemInFormButton").focus();
                }, 300);
        }
        else if (this._currentStep === 7) {
            window.scrollTo(0, 0);
            document.getElementById("navbar-toggler-button").click();
        }
      });

      intro.start();
}

function showTour() {
    startIntro();
}