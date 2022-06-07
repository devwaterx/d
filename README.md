# What is aero?
Aero is an interception-based web proxy.

# Why use aero?
> Use UV until aero releases, you could always use UV alongside Aero

Aero is the first proxy with an interception design

# How does aero work?

1. a service worker is registered
2. the service worker intercepts the request using the fetch event
3. the request data is copied
4. the cookie request header is rewritten
5. the request is sent using fetch api
6. the set-cookie and location response is rewritten 
7. the scripts for interception are injected at the top of the html dom
8. the file is rewritten depending on the content type
**HTML**
 - the character set is set to utf-8
> the config scripts is injected
> the second script is injected for intercepting html with a service worker
 - a mutation observer is registered
> every node is being iterated through with the records being cleared each time so that there are no duplicates   
 - nonce attribute is removed
 - integral attribute is removed
> in the case of script
 - the element is copied and the old one is deleted
 - src attribute is rewritten
 - type attribute is rewritten
 - inside innerHTML the location api is rewritten using scoping
> in the case of meta
 - the element is copied and the old one is deleted
 - if present the csp rule for
> in the case of anchor
 - href is rewritten
> in the case of form
 - action is rewritten
> the third script is injected where all the apis are proxified and overwritten
**JS**
 - the location api is rewritten using scoping
9. a new response is created
10. the response is returned