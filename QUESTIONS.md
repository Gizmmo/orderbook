## What would you add to your solution if you had more time

Almost certainly something to throttle the incoming calls from the websocket.  As it is right now, it is super noisy, but with getting the page (somewhat) designed, being fully tested, and getting everything going, that wasn't something I was able to get time to get too.  I think either throttling the render for that component, or pooling the calls and sending them to the reducer less frequently if possible.

## What would you do if you had done differently if you knew the page was going to get thousands of views per second

To be honest my worry would mostly be on the server side being able to handle that, but two things I can think of for sure would be making sure that if another component where to use the websocket hook, to make sure that they share data and only open 1 socket rather then having multiple components using it.  Especially right now, it is stored in a useReducer and if used in multiple places would open multiple sockets.  A good option for the data part may be redux, and then using context or redux to ensure only 1 socket is open

Another option to clean up would be to ensure when leaving the webpage we close the socket until the user returns.  So if they switch to another program or tab, we dont leave the socket constantly running in the background.

## What is the most useful feature added to the latest verion of you chosen language?

Whether its the most useful or not is debatable, but in TypeScript 4.0 a really useful feature is labelled tuple types which I use in gathering the socket data and storing it in the Reducer.

```ts
export type SocketTuple = [price: number, quantity: number];
export type SocketResponseData = SocketTuple[];
```

## How would you track down a performance issue in production.  Habe you ever had to do this.

For tracking down a performance issue theres a few ways we can go.  One great tool is the the chrome audit tools that will run a performance break down a ton of performance issues for you right off the bat and allow you to try and knock them off.  I know my team at iQmetrix used this in the past to try and get our app more efficient, and it gives you a nice grade at the end to kind of get a rough idea of where youre at.

Otherwise if its an issue you know where-ish its happening, you can try and using the react devtools to profile the issue, or just use chromes web profilier to try and find where large hangups on scripts is.  And obviously you also want to check the network calls too, to make sure you're not sending more network calls then chrome allows.

## Can you describe common security concerns for a front end developer?

I suppose the most common security concern is goin to be XSS where someone can cause malicious code to run on other users webpages, which is mostly done through user input data that is not properly santized before going to other users sites.

Another big issue thats becoming more prevelant I've begun to hear about is libraries where attackers will actually become maintainers of libraries far down the npm dependencies lists that are depended on by large known packages, and put in malicious code so that they are able to perform unwanted things on users computers.  I beleive axios actually had this problem somewhat recently.

Another issue would be CSRF, if the user has actions being performed by them that they did not want to do by using the users cookie data.

Another issue is using things like HSTS so that if a user is say hit by a man in the middle attack by using internet that they think is something like the airport-wifi, but is a spoof internet made to attack the user.

Using CSP to make sure that the websites scripts are only from trusted sources and not just being injected, and if somehow possible, only from self.

## How would you change the kraken API you just used?

So there are a few things. Firstly, I would change it so that all messages did not emit through a single message type. I would probably split them into various types, especially the removing of items. Using a 0 is alright, but it requires needing to look it up in documentation to see that it mean that that item has been removed from the list. This also allows our front end to efficiently be able to consume these messages, and not have to do if checks on every single message coming through. Other message types could include splitting asks and bids into thier own message type. Its a balance between performance and readability, I think delete for sure should be split out because its a weird side effect that any other developer or consumer would need to look up that it means to erase, but splitting the asks and bids and labeling the return is nicer from a self documentation point of view, but requires more data consistently over the wire.  For now I would say just at least to make a new message for deleting the items.

I would certainly throttle back the amount of update time, as 4-5 messages per second is a lot, and can even overlap itself fairly often. I would pool for a little longer and send it out every second even to lower the amount of bandwidth needed. Especially if this was to ramp up, the amount of messages being sent per second is very high
