var streams = require("stream");
var Readable = streams.Readable;
var Writable = streams.Writable;

exports.StreamEmitter = StreamEmitter;

function StreamEmitter(emitter) {
	if (!(this instanceof StreamEmitter))
		return new StreamEmitter(emitter);
	if (!emitter.on || !emitter.emit || !emitter.removeListener)
		throw new Error("Invalid EventEmitter instance passed to StreamEmitter");
	this._emitter = emitter;
}

StreamEmitter.prototype.on = function (event) {
	var emitter = this._emitter;
	if (!emitter) throw new Error("StreamEmitter not properly inialized");
	var stream = new Readable({
		objectMode: true
	});
	stream._read = function () {
		// No-op
	}
	emitter.on(event, handler);

	function handler(data) {
		if (!stream.push(data))
			emitter.removeListener(event, handler);
	}
	return stream;
}

StreamEmitter.prototype.emit = function (topic) {
	var emitter = this._emitter;
	if (!emitter) throw new Error("StreamEmitter not properly inialized");
	var stream = new Writable({
		objectMode: true
	});
	stream._write = function (chunk, enc, next) {
		emitter.emit(topic, chunk);
		next();
	}
	return stream;
}
