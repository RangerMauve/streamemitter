var streams = require("stream");
var EventEmitter = require("events").EventEmitter;
var Readable = streams.Readable;
var Writable = streams.Writable;
var Duplex = streams.Duplex;

exports.StreamEmitter = StreamEmitter;

/**
 * Constructs a new StreamEmitter
 * @param {EventEmitter} emitter Optional EventEmitter-comatible object to listen to events on
 */
function StreamEmitter(emitter) {
	// If it wasn't called as a constructor, call it as one
	if (!(this instanceof StreamEmitter))
		return new StreamEmitter(emitter);
	// If an emitter instace was not provided, create one
	if (!emitter)
		emitter = new EventEmitter();
	// If the emitter _was_ provided, but is incompatible, throw an error
	if (!emitter.on || !emitter.emit || !emitter.removeListener)
		throw new Error("Invalid EventEmitter instance passed to StreamEmitter");
	var self = this;

	// Save a reference to the emitter on the object
	this._emitter = emitter;

	// Create the duplex stream for synchronization
	this.synchronize = new Duplex({
		objectMode: true
	});
	// The read funtion is a no-op for hopefully obvious reasons
	this.synchronize._read = function () {}; // No-op
	// When written to, it emits on the emitter
	this.synchronize._write = function (chunk, enc, next) {
		var event = chunk.event;
		var data = chunk.data;
		self._emitter.emit(event, data);
		next();
	}
}

// Because performance, I guess
StreamEmitter.prototype._emitter = null;
StreamEmitter.prototype.synchronize = null;

/**
 * Creates a readable stream for a given event
 * @param  {String} event The event to listen on
 * @return {Stream}       The readable objectMode stream
 */
StreamEmitter.prototype.on = function (event) {
	var emitter = this._emitter;
	// Create a new readable stream for the emitter
	var stream = new Readable({
		objectMode: true
	});
	stream._read = function () {}; // No-op
	// listen to events
	emitter.on(event, handler);

	function handler(data) {
		// When the event is emitted, push it down the stream
		// If push returns `null`, remove the listener
		if (!stream.push(data))
			emitter.removeListener(event, handler);
	}
	return stream;
}

/**
 * Creates a writable stream for a given event
 * @param  {String} event The event to emit to
 * @return {Stream}       The readable stream that emits events when written to
 */
StreamEmitter.prototype.emit = function (event) {
	var self = this;
	// Create a new writable stream
	var stream = new Writable({
		objectMode: true
	});
	// When written to, emit onto the emitter
	stream._write = function (chunk, enc, next) {
		var emitter = self._emitter;
		var synchronize = self.synchronize;
		// Emit on the emitter
		emitter.emit(event, chunk);
		// Push down the synchronization stream
		synchronize.push({
			event: event,
			data: chunk
		});
		// Call the callback
		next();
	}
	return stream;
}
