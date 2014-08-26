var EventEmitter = require("events").EventEmitter;
var streams = require("stream");
var Readable = streams.Readable;
var Writable = streams.Writable;

function StreamEmitter() {

}

StreamEmitter.prototype._emitter = null;

StreamEmitter.prototype.on = function(event, fn) {
	var emitter = this._emitter;
	if (!emitter) throw new Error("StreamEmitter not properly inialized");
	if (fn) return emitter.on(event, fn);
	var stream = new Readable({
		objectMode: true
	});
	emitter.on(event, function(data) {
		stream.push(data);
	});
	return stream;
}

StreamEmitter.prototype.emit(topic, data) {
	var emitter = this._emitter;
	if (!emitter) throw new Error("StreamEmitter not properly inialized");
	if (data)
		return emitter.emit(topic, data);
	var stream = new Writable({
		objectMode: true
	});
	stream._write = function(chunk, enc, next) {
		emitter.emit(topic, chunk);
		next();
	}
	return stream;
}

StreamEmitter.prototype.removeListener(event, listener) {
	var emitter = this._emitter;
	if (!emitter) throw new Error("StreamEmitter not properly inialized");
	return this.emitter.removeListener(event, listener);
}
