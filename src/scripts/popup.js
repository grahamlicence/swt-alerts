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
    init: function () {
        var toggleBtn = document.querySelectorAll('.js-preferences')[0],
            switchBtn = document.querySelectorAll('.js-switch')[0],
            closeBtn = document.querySelectorAll('.js-close-preferences')[0];

        toggleBtn.addEventListener('click', this.toggle);
        closeBtn.addEventListener('click', this.toggle);
    }
};

// Initialise popup
SWT.preferences.init();