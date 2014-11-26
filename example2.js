var StreamEmitter = require("./").StreamEmitter;
var StreamArray = require("stream-array");
var stdout = require("stdout");

var e1 = new StreamEmitter();
var e2 = new StreamEmitter();

e1.synchronize.pipe(e2.synchronize).pipe(e1.synchronize);

e2.on("message").pipe(stdout());
StreamArray(["a", "b", "c", "d"]).pipe(e1.emit("message"));
