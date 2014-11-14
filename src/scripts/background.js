var SWT = {
    settings: {
        fromSt: '',
        toSt: '',
        useTube: false,
        tubeStation: ''
    },

    title: 'Good Service',

    url: '',

    // Get the RSS feed using promises
    get: function (url) {
      // Return a new promise.
      return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
          // This is called even on 404 etc
          // so check the status
          if (req.status == 200) {
            // Resolve the promise with the response text
            resolve(req);
          }
          else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error
            reject(Error(req.statusText));
          }
        };

        // Handle network errors
        req.onerror = function() {
          reject(Error("Network Error"));
        };

        // Make the request
        req.send();
      });
    },

    dataSort: function (response) {
        console.log('Loaded')
        console.log(response);
        console.log(response.responseXML.getElementsByTagName('item'));
    },

    // error getting feed
    dataError: function (error) {
        console.log("Failed!", error);
    },

    updateData: function () {
        this
            .get(this.url)
            .then(this.dataSort, this.dataError);
    },
    
    init: function () {

        // update settings from localStorage
        this.settings.fromSt = localStorage.from || '';
        this.settings.toSt = localStorage.to || '';
        this.settings.useTube = localStorage.useTube === 'true' ? true : false;
        this.settings.tubeStation = this.settings.fromSt === '' ? '' : 'THIS_STATION';

        // set url for the feed
        // this.url = 'http://rss.journeycheck.com/southwesttrains/southwesttrains/route?action=search&from=' + SWT.settings.fromSt + '&to=' + SWT.settings.toSt + '&period=today&formTubeUpdateLocation=' + SWT.settings.tubeStation + '&formTubeUpdatePeriod=&savedRoute=';
        
        // local testing
        this.url = '../tests/data/notification.rss';

        // setInterval(function() {
        //     requestFeed();
        // }, 300000); //check every 5 minutes

        this.updateData();
    }

};

// Initialise background
SWT.init();