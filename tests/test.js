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
        expect(SWT.preferences.open).toBe(false);
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
        SWT.Status.title();
        expect(SWT.title).toEqual(message);
    });

    it("show Service Change if updates.general or service.notification and no other issues", function() {
        message = 'Service Change';
        SWT.service.notification = true;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);

        SWT.service.notification = false;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = true;
        SWT.updates.line = false;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);
    });

    it("show Trains Delayed if service.delays and no other issues", function() {
        message = 'Trains Delayed';
        SWT.service.notification = false;
        SWT.service.delays = true;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);
    });

    it("show Trains Delayed if service.delays and service.notification but no other issues", function() {
        message = 'Trains Delayed';
        SWT.service.notification = true;
        SWT.service.delays = true;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);
    });

    it("show Trains Cancelled if service.cancellations and no other issues", function() {
        message = 'Trains Cancelled';
        SWT.service.notification = false;
        SWT.service.delays = false;
        SWT.service.cancellations = true;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);
    });

    it("show Trains Cancelled if service.cancellations and any combination of service.notification/service.delays and no other issues", function() {
        message = 'Trains Cancelled';
        SWT.service.notification = true;
        SWT.service.delays = true;
        SWT.service.cancellations = true;
        SWT.updates.general = false;
        SWT.updates.line = false;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);

        SWT.service.notification = false;
        SWT.service.delays = true;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);

        SWT.service.notification = true;
        SWT.service.delays = false;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);
    });

    it("show Line blocked if updates.line and no other issues", function() {
        message = 'Line Blocked';
        SWT.service.notification = false;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = true;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);
    });

    it("show Line blocked if updates.line and any combination of service.notification/service.cancellations/service.delays and no other issues", function() {
        message = 'Line Blocked';
        SWT.service.notification = true;
        SWT.service.delays = false;
        SWT.service.cancellations = false;
        SWT.updates.general = false;
        SWT.updates.line = true;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);

        SWT.service.notification = false;
        SWT.service.delays = true;
        SWT.service.cancellations = false;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);

        SWT.service.delays = false;
        SWT.service.cancellations = true;
        SWT.Status.title();
        expect(SWT.title).toEqual(message);
    });

});







