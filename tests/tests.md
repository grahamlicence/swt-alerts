Settings Tests

DOM tests
clicking the edit button should show the preferences form
clicking the close button should hide the form

Status type
should have station update if category 'Station Updates'
should have line update if title contains 'Line problem' or decription contains 'problem at a level crossing' 
should have general update if description contains 'We will run a normal weekday service' or 'Customer Information Systems fault' 
should have service notification if description contains 'Will be formed of' or 'will be started' 
should have delays if description contains 'This train has been delayed' or 'no longer call' or title contains 'Delays' 
should have cancellations if description contains 'will be cancelled' or 'will be terminated' 


Status title
should show Good Service if no other issues
should show Service Change if updates.general or service.notification and no other issues
should show Trains Delayed if service.delays and no other issues
should show Trains Delayed if service.delays and service.notification but no other issues
should show Trains Cancelled if service.cancellations and no other issues
should show Trains Cancelled if service.cancellations and any combination of service.notification/service.delays and no other issues
should show Line blocked if updates.line and no other issues
should show Line blocked if updates.line and any combination of service.notification/service.cancellations/service.delays and no other issues

Status icon
should show green is service good
should show yellow if short formation/notification
should show orange if delays
should show red if cancellations or line problems

