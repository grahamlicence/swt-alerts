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
                    pubDate: item.getElementsByTagName('pubDate')[0].innerHTML,
                    category: item.getElementsByTagName('category')[0].innerHTML
                };
                if (item.getElementsByTagName('link').length) {
                    itemObj.link = item.getElementsByTagName('link')[0].innerHTML;
                }
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
        none: true,
        general: false,
        generalItems: [],
        line: false,
        lineItems: [],
        station: false,
        stationItems: []
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
        SWT.updateSettings();
        SWT
            .get(SWT.url)
            .then(SWT.dataSort, SWT.dataError);
    },

    categoriseItem: function (item) {

        function manualCheck () {
            var title = item.title,
                desc = item.description;
            
            switch (true) {
                case title.contains('Delays'):
                case desc.contains('delayed'):
                    SWT.service.delays = true;
                    SWT.service.delaysItems.push(item);
                break;
                
                case title.contains('Cancellations'):
                case desc.contains('terminated'):
                case desc.contains('cancelled'):
                    SWT.service.cancellations = true;
                    SWT.service.cancellationsItems.push(item);
                break;
                
                case title.contains('Adverse Weather Timetable'):
                case desc.contains('This train will now run as scheduled'):
                case desc.contains('all lines are now open'):
                case desc.contains('all lines have now reopened'):
                case desc.contains('First class not available'):
                case desc.contains('Toilets are not available'):
                case desc.contains('Catering is not available'):
                case desc.contains('will call additionally'):
                case desc.contains('coaches instead of'):
                case desc.contains('will be started from'):
                    SWT.service.notification = true;
                    SWT.service.notificationItems.push(item);
                break;
                
                case desc.contains('some lines are blocked'):
                case desc.contains('all lines are blocked'):
                case desc.contains('fewer trains are able to run'):
                case desc.contains('trains have to run at reduced speed'):
                    SWT.updates.line = true;
                    SWT.updates.lineItems.push(item);
                break;
                
                case title.contains('Leaf Fall Timetable Alterations'):
                case title.contains('Normal Weekday Timetable'):
                case title.contains('Customer Information Systems'):
                    SWT.updates.general = true;
                    SWT.updates.generalItems.push(item);
                break;

                // just in case we don't know what it is
                default:
                    SWT.service.notification = true;
                    SWT.service.notificationItems.push(item);
            }
        }

        function categoryCheck () {
            switch (true) {
                case item.category.contains('Service Updates'):
                    
                    // check if delays or cancellations
                    manualCheck();
                break;

                case item.category.contains('Station Updates'):
                    SWT.updates.station = true;
                    SWT.updates.stationItems.push(item);
                break;

                case item.category.contains('General Updates'):
                    SWT.updates.general = true;
                    SWT.updates.generalItems.push(item);
                break;

                case item.category.contains('Line Updates'):
                    SWT.updates.line = true;
                    SWT.updates.lineItems.push(item);
                break;
            }
        }

        // If there is a category it's easier
        if (item.category.length) {
            categoryCheck();
        } else {
            // Sometimes data comes back with no category, so we have to second guess what the issue is
            manualCheck();
        }

    },

    // set status flags from data
    checkStatus: function () {
        var items = SWT.data.items;
        console.log(items)
        items.forEach(SWT.categoriseItem);
        console.log(SWT)
        SWT.global.pub('datacat')
    },

    setIcon: function () {
        SWT.title = 'Good Service';
        SWT.icon = 'service-good';

        // Start by raising the worst issue
        if (SWT.updates.line) {
            SWT.title = 'Line Blocked';
            SWT.icon = 'service-cancellations';
        } else if (SWT.service.cancellations) {
            SWT.title = 'Trains Cancelled';
            SWT.icon = 'service-cancellations';
        } else if (SWT.service.delays) {
            SWT.title = 'Trains Delayed';
            SWT.icon = 'service-delays';
        } else if (SWT.service.notification) {
            SWT.title = 'Service Change';
            SWT.icon = 'service-notification';
        } else if (SWT.updates.general) {
            SWT.title = 'Service Announcement';
            SWT.icon = 'service-notification-message';
        } else if (SWT.updates.station) {
            SWT.title = 'Station Update';
            SWT.icon = 'service-good-message';
        }

        // Set icon
        if (chrome.browserAction) {
            chrome.browserAction.setIcon({path: 'images/' + SWT.icon + '.png'});
            chrome.browserAction.setTitle({title: SWT.title});
        }
    },

    updateSettings: function () {
        this.settings.fromSt = localStorage.from || '';
        this.settings.toSt = localStorage.to || '';
        this.settings.useTube = localStorage.useTube === 'true' ? true : false;
        this.settings.tubeStation = this.settings.fromSt === '' ? '' : 'THIS_STATION';

        SWT.setUrl();
    },

    setUrl: function () {

        // set url for the feed
        // this.url = 'http://rss.journeycheck.com/southwesttrains/southwesttrains/route?action=search&from=' + SWT.settings.fromSt + '&to=' + SWT.settings.toSt + '&period=today&formTubeUpdateLocation=' + SWT.settings.tubeStation + '&formTubeUpdatePeriod=&savedRoute=';
        
        // local testing
        this.url = '../tests/data/noupdates.rss?from=' + SWT.settings.fromSt + '&to=' + SWT.settings.toSt;
        // this.url = '../tests/data/notification.rss?from=' + SWT.settings.fromSt + '&to=' + SWT.settings.toSt;
        // this.url = '../tests/data/general.rss?from=' + SWT.settings.fromSt + '&to=' + SWT.settings.toSt;
        // this.url = '../tests/data/delays.rss?from=' + SWT.settings.fromSt + '&to=' + SWT.settings.toSt;
        // this.url = '../tests/data/line.rss?from=' + SWT.settings.fromSt + '&to=' + SWT.settings.toSt;
        // this.url = '../tests/data/cancellations.rss?from=' + SWT.settings.fromSt + '&to=' + SWT.settings.toSt;
        // this.url = '../tests/data/station.rss?from=' + SWT.settings.fromSt + '&to=' + SWT.settings.toSt;
    },
    
    init: function () {

        // update settings from localStorage
        this.updateSettings();

        // setInterval(function() {
        //     requestFeed();
        // }, 300000); //check every 5 minutes

        this.updateData();
        SWT.global.sub('stationupdate', SWT.updateData);

        SWT.global.sub('dataupdate', SWT.checkStatus);
        SWT.global.sub('datacat', SWT.setIcon);
    }

};

// add in a simple contains object
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

// simple array search for station name using shortname
Array.prototype.has = function (v) {
    for (i = 0, l = this.length; i < l; i += 1){
        if (this[i].shortname === v) {
            return i;
        }
    }
    return false;
};

// Initialise background
SWT.init();