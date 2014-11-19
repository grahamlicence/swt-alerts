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

        function noIssues (selector, items) {
            selector.className += ' no-issues';
            selector.innerHTML = '<p>No known issues.</p>';
        }

        function hasIssues (selector, items) {
            selector.className = selector.className.replace(' no-issues', '');

            // clear current html
            selector.innerHTML = '';
            items.forEach(function (el) {
                selector.innerHTML += '<p><strong>' + el.title + '</strong>' + '<span>' + el.description + '</span><p>';
            });
        }

        // TODO: write test for this and refactor
        if (SWT.service.cancellations) {
            hasIssues(elements.service, SWT.service.cancellationsItems);
        } else {
            noIssues(elements.service, SWT.service.cancellationsItems);
        }

        if (SWT.service.notification) {
            hasIssues(elements.service, SWT.service.notificationItems);
        } else {
            noIssues(elements.service, SWT.service.notificationItems);
        }

        if (SWT.service.delays) {
            hasIssues(elements.service, SWT.service.delaysItems);
        } else {
            noIssues(elements.service, SWT.service.delaysItems);
        }

        if (SWT.updates.general) {
            hasIssues(elements.general, SWT.updates.generalItems);
        } else {
            noIssues(elements.general, SWT.updates.generalItems);
        }

        if (SWT.updates.line) {
            hasIssues(elements.line, SWT.updates.lineItems);
        } else {
            noIssues(elements.line, SWT.updates.lineItems);
        }

        if (SWT.updates.station) {
            hasIssues(elements.station, SWT.updates.stationItems);
        } else {
            noIssues(elements.station, SWT.updates.stationItems);
        }
    },

    // add the data feed date
    setDate: function () {
        var date = new Date(SWT.data.date);
        document.querySelectorAll('.pubdate')[0].innerHTML = date.toLocaleTimeString();
    },

    init: function () {
        var toggleBtn = document.querySelectorAll('.js-preferences')[0],
            switchBtn = document.querySelectorAll('.js-switch')[0],
            closeBtn = document.querySelectorAll('.js-close-preferences')[0];

        toggleBtn.addEventListener('click', this.toggle);
        closeBtn.addEventListener('click', this.toggle);
        
        SWT.global.sub('dataupdate', SWT.preferences.setDate);

        SWT.global.sub('datacat', SWT.preferences.displayIssues);
    }
};

// Hide messages using sessionStorage
SWT.hideNotification = {

};

// Initialise popup
SWT.preferences.init();