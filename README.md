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
