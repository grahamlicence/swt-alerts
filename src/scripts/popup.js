var SWT = SWT || {};

// change preferences
SWT.preferences = {
    open: false,
    toggle: function (e) {
        e.preventDefault();
        var pref = document.querySelectorAll('.preferences')[0];
        if (SWT.preferences.open) {
            pref.className = pref.className.replace(' open', '');
        } else {
            pref.className += ' open';
        }
        SWT.preferences.open = !SWT.preferences.open;
    },

    // list out the current issues
    displayIssues: function () {
        var elements = {
            general: document.querySelector('.general'),
            line: document.querySelector('.line'),
            service: document.querySelector('.service'),
            // tube: document.querySelector('.tube'),
            station: document.querySelector('.station')
        };

        function noIssues (selector) {
            selector.parentNode.className += ' no-issues';
            selector.innerHTML = '<p>No known issues.</p>';
        }

        function hasIssues (selector, items) {
            selector.parentNode.className = selector.parentNode.className.replace(' no-issues', '');
            
            // add issues
            items.forEach(function (el) {
                selector.innerHTML += '<p><strong>' + el.title + '</strong>' + '<span>' + el.description + '</span><p>';
            });
        }

        // clear html
        elements.general.innerHTML = '';
        elements.line.innerHTML = '';
        elements.service.innerHTML = '';
        elements.station.innerHTML = '';

        // TODO: write test for this and refactor
        if (SWT.service.cancellations) {
            hasIssues(elements.service, SWT.service.cancellationsItems);
        }
        if (SWT.service.notification) {
            hasIssues(elements.service, SWT.service.notificationItems);
        }
        if (SWT.service.delays) {
            hasIssues(elements.service, SWT.service.delaysItems);
        }

        if (!SWT.service.cancellations && !SWT.service.notification  && !SWT.service.delays) {
            noIssues(elements.service);
        }

        if (SWT.updates.general) {
            hasIssues(elements.general, SWT.updates.generalItems);
        } else {
            noIssues(elements.general);
        }

        if (SWT.updates.line) {
            hasIssues(elements.line, SWT.updates.lineItems);
        } else {
            noIssues(elements.line);
        }

        if (SWT.updates.station) {
            hasIssues(elements.station, SWT.updates.stationItems);
        } else {
            noIssues(elements.station);
        }
    },

    // add the data feed date
    setDate: function () {
        var date = new Date(SWT.data.date);
        document.querySelectorAll('.pubdate')[0].innerHTML = date.toLocaleTimeString();
    },

    // change the to and from stations
    setStations: {

        popuplate: function (e) {
            e.preventDefault();
            console.log(this)
        },

        autoFill: function (input, autocompleteDiv) {
            var val = input.value.toUpperCase(),
                html = '';

            if (!val.length) {
                autocompleteDiv.innerHTML = '';
                return;
            }
            autocompleteDiv.style.display = 'block';

            //hard code search for waterloo
            if (val.indexOf('W') === 0 || val.indexOf('WA') === 0 || val.indexOf('WAT') === 0 || val.indexOf('WATE') === 0 || val.indexOf('WATER') === 0 || val.indexOf('WATERL') === 0 || val.indexOf('WATERLO') === 0 || val.indexOf('WATERLOO') === 0) {
                html += '<a href="" class="stationauto" data-short="WAT">LONDON WATERLOO</a>';
            }
            for (i = 0, l = SWT.stations.length; i < l; i += 1) {
                if (SWT.stations[i].name.indexOf(val) === 0) {
                    html += '<a href="" class="stationauto" data-short="' + SWT.stations[i].shortname + '">' + SWT.stations[i].name + '</a>';
                }
            }
            autocompleteDiv.innerHTML = html;
        },

        autocomplete: function (e, input, autocompleteDiv) {
            var autocomplete;
            
            // Any letter or backspace
            if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode === 8) {
                SWT.preferences.setStations.autoFill(input, autocompleteDiv);
            }

            // add click events
            autocomplete = autocompleteDiv.querySelectorAll('.stationauto');
            for (var i = 0, l = autocomplete.length; i < l; i += 1) {
                autocomplete[i].addEventListener('click', SWT.preferences.setStations.popuplate);
            }
        },

        chooseFirst: function (e, input, autocompleteDiv) {
            console.log('e')
            var id = '#' + this.id + 'stations .stationauto',
                stationList;
            if (e.keyCode === 13) {
                stationList = d.querySelectorAll(id);
                if (stationList.length) {
                    App.preferences.set(stationList[0]);
                }
            }
        },

        init: function () {
            var switchBtn = document.querySelector('.js-switch'),
                clearFrom = document.querySelector('.js-clear-from'),
                clearTo = document.querySelector('.js-clear-to'),
                inputFields = document.querySelectorAll('.js-input'),
                autocomplete = document.querySelectorAll('.js-autocomplete');

            // attach events
            function attachEvents (ind) {
                inputFields[ind].addEventListener('keyup', function (e) {
                    SWT.preferences.setStations.autocomplete(e, inputFields[ind], autocomplete[ind]);
                });
                inputFields[ind].addEventListener('keydown', function (e) {
                    SWT.preferences.setStations.chooseFirst(e, inputFields[ind], autocomplete[ind]);
                });
            }

            // no forEach on elements
            for (var i = 0, l = inputFields.length; i < l; i += 1) {
                attachEvents(i);
            }

            //SWT.global.pub('stationupdate');
        }
    },

    init: function () {
        var toggleBtn = document.querySelector('.js-preferences'),
            closeBtn = document.querySelector('.js-close-preferences'),
            closePopupBtn = document.querySelector('.js-close-popup');

        toggleBtn.addEventListener('click', this.toggle);
        closeBtn.addEventListener('click', this.toggle);
        closePopupBtn.addEventListener('click', window.close);

        toggleBtn.click();
        
        // listen for data updates
        SWT.global.sub('dataupdate', SWT.preferences.setDate);
        SWT.global.sub('datacat', SWT.preferences.displayIssues);

        SWT.preferences.setStations.init();
    }
};

// TODO: allow for hiding notifications, eg 11pm train having 4 carriages
// Hide messages using sessionStorage
SWT.hideNotification = {

};

// Initialise popup
SWT.preferences.init();