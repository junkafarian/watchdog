The Amnesty International Watchdog
==================================

This project is a proof of concept prototype for a web service for internet
users at risk of being unlawfully detained. This service allows users to
voluntarily configure monitoring on their public web activity so that
notifications can be sent to their friends and family in the event of
significant change to their online usage (namely a prolonged period of
inactivity)

System Behaviour
----------------

The platform is designed to work between thresholds to determine whether a user
is either:

* Active - The user has either checked in or one of his configured feeds has shown activity recently
* Unknown - The user has not been as active as they usually are, however it is not necessarily cause for alarm
* Offline - Either none of the streams that the user is normally active on have been updated for an extended period of time or the user has alerted the system that they are in danger

Configured sources
------------------

* Online checkins through the system
* Twitter activity monitoring

Suggested Next steps
--------------------

* Configure email notifications for when a user goes offline
* Configure more sources for monitoring online activity such as facebook / blog rss feeds
* Mapping offline users by location on a google map

