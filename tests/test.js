describe("Status", function() {
    var issues,
        message = 'Good Service';

    it("should show Good service if no issues", function() {
        issues = 0;
        expect(SWT.title).toEqual(message);
    });
});