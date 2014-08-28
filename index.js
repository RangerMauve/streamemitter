var streams = require("stream");
var Readable = streams.Readable;
var Writable = streams.Writable;

exports.StreamEmitter = StreamEmitter;

function StreamEmitter(emitter) {
	if (!emitter.on || !emitter.emit || !emitter.removeListener)
		throw new Error("Invalid EventEmitter instance passed to StreamEmitter");
	this._emitter = emitter;
}

StreamEmitter.prototype.on = function(event, fn) {
	var emitter = this._emitter;
	if (!emitter) throw new Error("StreamEmitter not properly inialized");
	if (fn) return emitter.on(event, fn);
	var stream = new Readable({
		objectMode: true
	});
	stream._read = function() {
		// No-op
	}
	emitter.on(event, handler);

	function handler(data) {
		if (!stream.push(data))
			emitter.removeListener(event, handler);
	}
	return stream;
}

StreamEmitter.prototype.emit = function(topic, data) {
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

StreamEmitter.prototype.removeListener = function(event, listener) {
	var emitter = this._emitter;
	if (!emitter) throw new Error("StreamEmitter not properly inialized");
	return this.emitter.removeListener(event, listener);
}
