/**
 * Class Listener
 *
 * @param {Object} storage
 * @param {String|RegExp} identifier
 * @param {Function} callback
 * @param {Boolean=} prepend
 * @param {Number=} limit
 */
export default function Listener(storage, identifier, callback, prepend, limit) {
	this.identifier = identifier;
	this.callback = callback;
	this.timestamp = !prepend
		? +new Date()
		: (storage.timestamp = storage.timestamp - 1);
	this.remaining = limit;
}

export default Listener;
