# StreamEmitter

This module takes the easy interface of EventEmitters and replaces callbacks
with streams. After wrapping a source emitter you can turn any events related
to it into streams, and can pipe streams to emit events on data.

## Installing

``` bash
npm install --save streamemitter
```

## API

###`StreamEmitter(eventemitter)`
Constructs a new StreamEmitter and wraps over
the given `eventemitter` and uses it for creating streams.

###`StreamEmitter#on(event)`
Returns a readable stream which receives data every
time `event` is emitted on the eventemitter

###`StreamEmitter#emit(event)`
Returns a writable stream which emits any data
passed in on the eventemitter with the given event.

## Example
``` javascript
var StreamEmitter = require("./index.js").StreamEmitter;
var EventEmitter = require("events").EventEmitter;

var events = new EventEmitter();
var streams = new StreamEmitter(events);

// Relay all `message` events to STDOUT
streams.on("message").pipe(process.stdout);

// Relay all `message` events into `message2` using the writable stream from emit
streams.on("message").pipe(streams.emit("message2"));

// Relay all `message2` events to STDOUT as well
streams.on("message2").pipe(process.stdout);

var times = 5;
var interval = setInterval(function () {
  // Emit an event on the original event listener
  events.emit("message", "Ping:" + times + "\n");
  times--;
  if (!times) clearInterval(interval);
}, 1000);
```
