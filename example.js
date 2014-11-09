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
