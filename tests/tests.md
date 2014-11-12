Settings Tests

DOM tests
clicking the edit button should show the preferences form
clicking the close button should hide the form

Status type
If category 'Station Updates' stationUpdates should be more than 0
If title contains 'Line problem' or decription contains 'problem at a level crossing' updates.line should be more than 0
If description contains 'We will run a normal weekday service' or 'Customer Information Systems fault' updates.general should be more than 0
If description contains 'Will be formed of' serviceUpdates and service.notification should be more than 0
If description contains 'will be started' serviceUpdates and service.notification should be more than 0
If description contains 'This train has been delayed' serviceUpdates and service.delays should be more than 0
If description contains 'no longer call' serviceUpdates and service.delays should be more than 0
If title contains 'Delays' serviceUpdates and service.delays should be more than 0
If description contains 'will be cancelled' serviceUpdates and service.cancelled should be more than 0
If description contains 'will be terminated' serviceUpdates and service.cancelled should be more than 0


Status title
Show Good Service if no other issues
Show Service Change if updates.general or service.notification and no other issues
Show Trains Delayed if service.delays and no other issues
Show Trains Delayed if service.delays and service.notification but no other issues
Show Trains Cancelled if service.cancellations and no other issues
Show Trains Cancelled if service.cancellations and any combination of service.notification/service.delays and no other issues
Show Line blocked if updates.line and no other issues
Show Line blocked if updates.line and any combination of service.notification/service.cancellations/service.delays and no other issues

Status icon
Show green is service good
Show yellow if short formation/notification
Show orange if delays
Show red if cancellations or line problems

Status message
Show 'No issues' if no service updates
Show 'No issues' if no general updates
Show 'No issues' if no line updates
Show 'No issues' if no station updates
Show 'No issues' if no tube updates
Show 'No updates set' if no tube updates in settings
Show issues if service updates
Show issues if general updates
Show issues if line updates
Show issues if station updates
Show issues if tube updates
