# StreamEmitter

This module takes the easy interface of EventEmitters and replaces callbacks
with streams. After wrapping a source emitter you can turn any events related
to it into streams, and can pipe streams to emit events on data.

## Installing

``` bash
npm install --save streamemitter
```

## API

###`StreamEmitter([eventemitter])`
Constructs a new StreamEmitter and wraps over
the given `eventemitter` and uses it for creating streams.
If no eventemitter is provided, one is created behind the scenes

###`StreamEmitter#on(event)`
Returns a readable stream which receives data every
time `event` is emitted on the eventemitter

###`StreamEmitter#emit(event)`
Returns a writable stream which emits any data
passed in on the eventemitter with the given event.

###`StreamEmitter#synchronize`
A duplex stream that can be used for synchronizing instances of StreamEmitter

*Note: Currently only events that are emitted using the `StreamEmitter#emit`
method can be synchronized. The alternative would require that the `eventemitter`'s
`emit` method gets patched, which may not always be desirable.*

## Example
``` javascript
var StreamEmitter = require("streamemitter").StreamEmitter;
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

## Synchronization example
``` javascript
var StreamEmitter = require("streamemitter").StreamEmitter;
var StreamArray = require("stream-array");
var stdout = require("stdout");

var e1 = new StreamEmitter();
var e2 = new StreamEmitter();

e1.synchronize.pipe(e2.synchronize).pipe(e1.synchronize);

e2.on("message").pipe(stdout());
StreamArray(["a", "b", "c", "d"]).pipe(e1.emit("message"));

```
