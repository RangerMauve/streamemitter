var StreamEmitter = require("./index.js").StreamEmitter;
var EventEmitter = require("events").EventEmitter;

var events = new EventEmitter();
var streams = new StreamEmitter(events);

streams.on("message").pipe(process.stdout);

var times = 15;
var interval = setInterval(function() {
	events.emit("message", "Ping:" + times+"\n");
	times--;
	if (!times) clearInterval(interval);
}, 1000);
