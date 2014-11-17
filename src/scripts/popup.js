var SWT = SWT || {};

// change preferences
SWT.preferences = {
    open: false,
    toggle: function (e) {
        e.preventDefault();
        var pref = document.querySelectorAll('.preferences')[0];
        if (this.open) {
            pref.className = pref.className.replace(' open', '');
        } else {
            pref.className += ' open';
        }
        this.open = !this.open;
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
        
        SWT.global.sub('dataupdate', function () {
            SWT.preferences.setDate();
        });
    }
};

// Hide messages using sessionStorage
SWT.hideNotification = {

};

// Initialise popup
SWT.preferences.init();