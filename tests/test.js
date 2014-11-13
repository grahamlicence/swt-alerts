// What are the messages?
// SWT.service.notification     different coaches or started from different station
// SWT.service.delays           any train delay
// SWT.service.cancellations    any cancellation
// SWT.updates.general          Adverse Weather Timetable/We will run a normal weekday service/Customer Information Systems fault
// SWT.updates.line             Line problem/problem at a level crossing


describe("Preferences buttons", function() {
    SWT.preferences.open = false;

    it("clicking the edit button should show the preferences form", function() {
        SWT.preferences.toggle();
        expect(SWT.preferences.open).toBe(true);
    });

    it("clicking the close button should hide the form", function() {
        SWT.preferences.toggle();
        expect(SWT.preferences.open).not.toBe(true);
    });

});

describe("Status type", function() {
    // test RSS item
    var item = {
        description: '',
        title: '',
        category: ''
    };

    it("should have station update if category 'Station Updates'", function () {
        item.category = 'Station Updates';
        SWT.categoriseItem(item);
        expect(SWT.updates.station).toBe(true);
    });

    it("should have line update if title contains 'Line problem' or decription contains 'problem at a level crossing'", function () {
        item.title = 'Line problem: between London Waterloo and Wimbledon.';
        SWT.categoriseItem(item);
        expect(SWT.updates.line).toBe(true);

        item.title = '';
        item.description = 'Owing to a problem at a level crossing at Cosham trains have to run at reduced speed on London-bound lines.';
        SWT.categoriseItem(item);
        expect(SWT.updates.line).toBe(true);
    });

    it("should have general update if description contains 'We will run a normal weekday service' or 'Customer Information Systems fault'", function () {
        item.description = 'We will run a normal weekday service on Tuesday 22 January. All lines will reopen with trains calling at all stations. In order for this to happen it is necessary to run test trains over lines which have been closed over the last few days due to icy weather conditions.';
        SWT.categoriseItem(item);
        expect(SWT.updates.general).toBe(true);

        item.description = 'Customer Information Systems fault';
        SWT.categoriseItem(item);
        expect(SWT.updates.general).toBe(true);
    });

    it("should have service notification if description contains 'Will be formed of' or 'will be started'", function () {
        item.description = 'Will be formed of 5 coaches instead of 10.';
        SWT.categoriseItem(item);
        expect(SWT.service.notification).toBe(true);

        item.description = 'This train will be started from Surbiton.';
        SWT.categoriseItem(item);
        expect(SWT.service.notification).toBe(true);
    });

    it("should have delays if description contains 'This train has been delayed' or 'no longer call' or title contains 'Delays'", function () {
        item.description = 'This train has been delayed at Salisbury and is now 17 minutes late.';
        SWT.categoriseItem(item);
        expect(SWT.service.delays).toBe(true);
        
        item.description = 'This train will no longer call at Hampton Wick, Kingston, Norbiton, New Malden, Raynes Park, Wimbledon, Earlsfield, Clapham Junction (on return at 17:09) and Vauxhall (on return at 17:14).';
        SWT.categoriseItem(item);
        expect(SWT.service.delays).toBe(true);
        
        item.title = 'Delays to services';
        item.description = '';
        SWT.categoriseItem(item);
        expect(SWT.service.delays).toBe(true);
    });

    it("should have cancellations if description contains 'will be cancelled' or 'will be terminated'", function () {
        item.description = 'This train will be cancelled.';
        SWT.categoriseItem(item);
        expect(SWT.service.cancelled).toBe(true);

        item.description = 'This train will be terminated at Kingston.';
        SWT.categoriseItem(item);
        expect(SWT.service.cancelled).toBe(true);
    });

});

describe("Status title", function() {
    var message = 'Good Service';

    it("should show Good service if no issues", function() {
        SWT.service.notification = false;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);
    });

    it("should show Service Change if updates.general or service.notification and no other issues", function() {
        message = 'Service Change';
        SWT.service.notification = true;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);

        SWT.service.notification = false;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = true;
        SWT.updates.line = false;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);
    });

    it("should show Trains Delayed if service.delays and no other issues", function() {
        message = 'Trains Delayed';
        SWT.service.notification = false;
        SWT.service.delays = true;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);
    });

    it("should show Trains Delayed if service.delays and service.notification but no other issues", function() {
        message = 'Trains Delayed';
        SWT.service.notification = true;
        SWT.service.delays = true;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);
    });

    it("should show Trains Cancelled if service.cancellations and no other issues", function() {
        message = 'Trains Cancelled';
        SWT.service.notification = false;
        SWT.service.delays = false;
        SWT.service.cancellations = true;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);
    });

    it("should show Trains Cancelled if service.cancellations and any combination of service.notification/service.delays and no other issues", function() {
        message = 'Trains Cancelled';
        SWT.service.notification = true;
        SWT.service.delays = true;
        SWT.service.cancellations = true;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);

        SWT.service.notification = false;
        SWT.service.delays = true;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);

        SWT.service.notification = true;
        SWT.service.delays = false;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);
    });

    it("should show Line blocked if updates.line and no other issues", function() {
        message = 'Line Blocked';
        SWT.service.notification = false;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = true;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);
    });

    it("should show Line blocked if updates.line and any combination of service.notification/service.cancellations/service.delays and no other issues", function() {
        message = 'Line Blocked';
        SWT.service.notification = true;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = true;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);

        SWT.service.notification = false;
        SWT.service.delays = true;
        SWT.service.cancellations = false;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);

        SWT.service.delays = false;
        SWT.service.cancellations = true;
        SWT.Status.setTitle();
        expect(SWT.title).toEqual(message);
    });

});

describe("Status icon", function() {
    it("should show green is service good", function () {
        SWT.service.notification = false;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setIcon();
        expect(SWT.icon).toEqual('service-good');
    });
    it("should show yellow if short formation/notification", function () {
        SWT.service.notification = true;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setIcon();
        expect(SWT.icon).toEqual('service-notification');

    });
    it("should show orange if delays", function () {
        SWT.service.notification = false;
        SWT.service.delays = true;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setIcon();
        expect(SWT.icon).toEqual('service-delays');

    });
    it("should show red if cancellations or line problems", function () {
        SWT.service.notification = false;
        SWT.service.delays = false;
        SWT.service.cancellations = true;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.setIcon();
        expect(SWT.icon).toEqual('service-cancellations');

    });
});



