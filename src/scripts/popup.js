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

        populate: function (stationName, input, list) {
            var shortInput = document.getElementById(input.getAttribute('data-short-input'));

            input.value = stationName.innerHTML;
            shortInput.value = stationName.getAttribute('data-short');
            console.log(stationName)
            console.log(shortInput.value)

            // clear auto fill list
            list.innerHTML = '';
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
                autocomplete[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    var name = this.innerHTML;
                    console.log(name)
                    SWT.preferences.setStations.populate(this, input, autocompleteDiv);
                });
            }
        },

        chooseFirst: function (e, input, autocompleteDiv) {
            var stationList;
                stationList = autocompleteDiv.querySelectorAll('a');

            console.log(stationList)
            if (stationList.length) {
                SWT.preferences.setStations.populate(stationList[0], input, autocompleteDiv);
            }
        },

        save: function (e) {
            if (e) {
                e.preventDefault();
            }
            var fromShort = document.getElementById('fromshort'),
                toShort = document.getElementById('toshort'),
                fromText = document.querySelector('.from-set'),
                toText = document.querySelector('.to-set');

            localStorage.from = fromShort.value;
            localStorage.to = toShort.value;
            // localStorage.useTube = el.tubeInput.checked;

            fromText.innerHTML = document.getElementById('from').value;
            toText.innerHTML = document.getElementById('to').value;

            SWT.global.pub('stationupdate');
        },

        // TODO: refactor using html templates
        switchDirection: function (e) {
            e.preventDefault();
            var fromShort = document.getElementById('fromshort'),
                from = document.getElementById('from'),
                fromShortValue = fromShort.value,
                fromValue = from.value,

                toShort = document.getElementById('toshort'),
                to = document.getElementById('to'),
                toShortValue = toShort.value,
                toValue = to.value;

            // swap values
            fromShort.value = toShortValue;
            from.value = toValue;
            toShort.value = fromShortValue;
            to.value = fromValue;

            // save and update journey if form closes
            if (!SWT.preferences.open) {
                SWT.preferences.setStations.save();
            }
        },

        init: function () {
            var switchBtn = document.querySelector('.js-switch'),
                clearFrom = document.querySelector('.js-clear-from'),
                clearTo = document.querySelector('.js-clear-to'),
                inputFields = document.querySelectorAll('.js-input'),
                autocomplete = document.querySelectorAll('.js-autocomplete'),
                saveBtn = document.querySelectorAll('.js-save')[0],
                fromShort = document.getElementById('fromshort'),
                toShort = document.getElementById('toshort'),
                from = localStorage.from || '',
                to = localStorage.to || '',
                fromText = document.querySelector('.from-set'),
                toText = document.querySelector('.to-set');

            // attach events
            function attachEvents (ind) {
                inputFields[ind].addEventListener('keyup', function (e) {
                    SWT.preferences.setStations.autocomplete(e, inputFields[ind], autocomplete[ind]);
                });
                inputFields[ind].addEventListener('keydown', function (e) {
                    console.log(e.keyCode)
                    
                    // pressed enter
                    if (e.keyCode === 13) {
                        SWT.preferences.setStations.chooseFirst(e, inputFields[ind], autocomplete[ind]);
                    
                    // pressed esc
                    } else if (e.keyCode === 27) {
                        inputFields[ind].value = '';
                        SWT.preferences.setStations.autoFill(inputFields[ind], autocomplete[ind]);
                    }
                });
            }

            // no forEach on elements
            for (var i = 0, l = inputFields.length; i < l; i += 1) {
                attachEvents(i);
            }

            // populate stations
            fromShort.value = from;
            toShort.value = to;

            function popName (station, ind, text) {
                if (station === 'WAT') {
                    inputFields[ind].value = 'LONDON WATERLOO';
                    name = 'LONDON WATERLOO';
                } else {
                    point = SWT.stations.has(station);
                    name = SWT.stations[point].name;
                    inputFields[ind].value = name;
                }
                text.innerHTML = name;
            }
            if (from) {
                popName(fromShort.value, 0, fromText);
            }
            if (to) {
                popName(toShort.value, 1, toText);
            }

            // add button click events
            clearFrom.addEventListener('click', function (e) {
                e.preventDefault();
                inputFields[0].value = '';
                SWT.preferences.setStations.autoFill(inputFields[0], autocomplete[0]);
            });
            clearTo.addEventListener('click', function (e) {
                e.preventDefault();
                inputFields[1].value = '';
                SWT.preferences.setStations.autoFill(inputFields[1], autocomplete[1]);
            });
            saveBtn.addEventListener('click', SWT.preferences.setStations.save);
            switchBtn.addEventListener('click', SWT.preferences.setStations.switchDirection);
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