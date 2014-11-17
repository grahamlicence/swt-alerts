var SWT = {

    global: {

        // custom feed converstion
        xmlToJson: function (xml) {
            var obj = {
                    items: []
                },
                channel = xml.getElementsByTagName('channel'),
                items = xml.getElementsByTagName('item');

            // add date
            obj.date = xml.getElementsByTagName('pubDate')[0].innerHTML;

            // add the status items
            function setItem(item) {
                var itemObj = {
                    title: item.getElementsByTagName('title')[0].innerHTML,
                    description: item.getElementsByTagName('description')[0].innerHTML,
                    link: item.getElementsByTagName('link')[0].innerHTML,
                    pubDate: item.getElementsByTagName('pubDate')[0].innerHTML,
                    category: item.getElementsByTagName('category')[0].innerHTML
                };
                obj.items.push(itemObj);
            }

            for (var i = 0; i < items.length; i += 1) {
                setItem(items[i]);
            }
            return obj;
        },

        // simple pub/sub
        pubsub: {
            topics: {},
            subUid: -1
        },

        sub: function(topic, func) {
            if (!SWT.global.pubsub.topics[topic]) {
                SWT.global.pubsub.topics[topic] = [];
            }
            var token = (++SWT.global.pubsub.subUid).toString();
            SWT.global.pubsub.topics[topic].push({
                token: token,
                func: func
            });
            return token;
        },
        
        pub: function(topic, args) {
            if (!SWT.global.pubsub.topics[topic]) {
                return false;
            }
            setTimeout(function() {
                var subscribers = SWT.global.pubsub.topics[topic],
                    len = subscribers ? subscribers.length : 0;
     
                while (len--) {
                    subscribers[len].func(topic, args);
                }
            }, 0);
            return true;
     
        },
        
        unsub: function(token) {
            for (var m in SWT.global.pubsub.topics) {
                if (SWT.global.pubsub.topics[m]) {
                    for (var i = 0, j = SWT.global.pubsub.topics[m].length; i < j; i++) {
                        if (SWT.global.pubsub.topics[m][i].token === token) {
                            SWT.global.pubsub.topics[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return false;
        }
    },

    settings: {
        fromSt: '',
        toSt: '',
        useTube: false,
        tubeStation: ''
    },

    // Service status
    service: {
        notification: false,
        notificationItems: [],
        delays: false,
        delaysItems: [],
        cancellations: false,
        cancellationsItems: []
    },
    updates: {
        general: false,
        generalItems: [],
        line: false,
        lineItems: []
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
        SWT.data = SWT.global.xmlToJson(response.responseXML);
        SWT.global.pub('dataupdate');
    },

    // error getting feed
    dataError: function (error) {
        console.error("Failed!", error);
    },

    updateData: function () {
        this
            .get(this.url)
            .then(this.dataSort, this.dataError);
    },

    categoriseItem: function (item) {
        // If it's given a category it's easier
        switch (item.category) {
            case 'Service Updates':
            break;
            case 'Station Updates':
            break;
            case 'General Updates':
            break;
            case 'Line Updates':
            break;
        }
        // Sometimes data comes back with no category, so we have to second guess what the issue is
    },

    // set status flags from data
    checkStatus: function () {
        var items = SWT.data.items;
        items.forEach(SWT.categoriseItem);
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
        // this.url = '../tests/data/notification.rss';
        this.url = '../tests/data/general.rss';

        // setInterval(function() {
        //     requestFeed();
        // }, 300000); //check every 5 minutes

        this.updateData();

        SWT.global.sub('dataupdate', SWT.checkStatus);
    }

};

// Initialise background
SWT.init();