const Emitter = require('../dist/umd/index');

describe('emit()', () => {
	test('should emit an event without additional parameters', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.on(unique, listener)
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(1);
					expect(listener.mock.calls[0].length).toBe(1);
					expect(listener.mock.calls[0][0]).toEqual({ context: emitter, name: unique });

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should emit an event with additional parameters', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.on(unique, listener)
				.emit(unique, 'param_first', 'param_second');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(1);
					expect(listener.mock.calls[0].length).toBe(3);
					expect(listener.mock.calls[0][0]).toEqual({ context: emitter, name: unique });
					expect(listener.mock.calls[0][1]).toBe('param_first');
					expect(listener.mock.calls[0][2]).toBe('param_second');

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should correctly execute broadcast listeners', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			Emitter
				.on(unique, listener);

			emitter
				.emit(unique, 'param_first', 'param_second');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(1);
					expect(listener.mock.calls[0].length).toBe(3);
					expect(listener.mock.calls[0][0]).toEqual({ context: emitter, name: unique });
					expect(listener.mock.calls[0][1]).toBe('param_first');
					expect(listener.mock.calls[0][2]).toBe('param_second');

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should correctly cancel an event', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			function cancel(event) {
				event.cancel();
			}

			emitter
				.on(unique, listener)
				.on(unique, cancel)
				.on(unique, listener)
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(1);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});
});

describe('on()', () => {
	test('should silently fail for invalid identifier', () => {
		const emitter = new Emitter();
		const unique  = {};

		emitter
			.on(unique, jest.fn());

		const registered = emitter.listener(unique);

		expect(Array.isArray(registered)).toBe(true);
		expect(registered.length).toBe(0);
	});

	test('should silently fail for invalid listeners', () => {
		const emitter = new Emitter();
		const unique  = (+new Date()).toString();

		emitter
			.on(unique, {});

		const registered = emitter.listener(unique);

		expect(Array.isArray(registered)).toBe(true);
		expect(registered.length).toBe(0);
	});

	test('should call an string listener repeatedly', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.on(unique, listener)
				.emit(unique)
				.emit(unique)
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(3);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should call an expression listener repeatedly', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();
			const regex    = new RegExp('^' + unique + '/(?:success|failure)');

			emitter
				.on(regex, listener)
				.emit(unique + '/none')
				.emit(unique + '/success')
				.emit(unique + '/failure')
				.emit(unique)
				.emit('none');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(2);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should call an array of listeners repeatedly', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.on([ unique, unique ], listener)
				.emit(unique)
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(4);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('local listeners should not listen to broadcast events', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.on(unique, listener);

			new Emitter()
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(0);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('listeners should be called sequentially', () => {
		return new Promise((resolve, reject) => {
			const callstack = [];
			const emitter   = new Emitter();
			const unique    = (+new Date()).toString();
			const listeners = [
				jest.fn(() => {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							callstack.push(1);
							resolve();
						}, 20)
					});
				}),
				jest.fn(()=> {
					callstack.push(2);
				})
			];

			emitter
				.on(unique, listeners[0])
				.on(unique, listeners[1])
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listeners[0].mock.calls.length).toBe(1);
					expect(listeners[1].mock.calls.length).toBe(1);
					expect(callstack).toEqual([ 1, 2 ]);

					resolve();
				} catch(error) {
					reject(error);
				}
			}, 40)
		});
	});
});

describe('once()', () => {
	test('should call a string listener only once', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.once(unique, listener)
				.emit(unique)
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(1);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should call an expression listener only once', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();
			const regex    = new RegExp('^' + unique + '/(?:success|failure)');

			emitter
				.once(regex, listener)
				.emit(unique + '/none')
				.emit(unique + '/success')
				.emit(unique + '/failure')
				.emit(unique)
				.emit('none');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(1);
					expect(listener.mock.calls[0][0]).toEqual({ context: emitter, name: unique + '/success' });

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should call an array of listeners only once', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.once([ unique, unique ], listener)
				.emit(unique)
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(2);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});
});

describe('limit()', () => {
	test('should call a string listener a limited number of times', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.limit(unique, 3, listener)
				.emit('none')
				.emit(unique)
				.emit(unique)
				.emit(unique)
				.emit(unique)
				.emit('none');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(3);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should call an expression listener a limited number of times', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();
			const regex    = new RegExp('^' + unique + '/(?:success|failure)');

			emitter
				.limit(regex, 3, listener)
				.emit('none')
				.emit(unique + '/success')
				.emit(unique + '/failure')
				.emit(unique + '/success')
				.emit(unique + '/failure')
				.emit('none');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(3);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should call an array of listeners a limited number of times', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.limit([ unique, unique ], 3, listener)
				.emit('none')
				.emit(unique)
				.emit(unique)
				.emit(unique)
				.emit(unique)
				.emit('none');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(6);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});
});


describe('off()', () => {
	test('should silently fail for invalid identifier', () => {
		const emitter = new Emitter();
		const unique  = (+new Date()).toString();
		const listener = jest.fn();

		emitter
			.on(unique, listener)
			.off({}, listener);

		const registered = emitter.listener(unique);

		expect(Array.isArray(registered)).toBe(true);
		expect(registered.length).toBe(1);
	});

	test('should silently fail for identifier without listeners', () => {
		const emitter = new Emitter();
		const unique  = (+new Date()).toString();
		const listener = jest.fn();

		emitter
			.off(unique, listener);

		const registered = emitter.listener(unique);

		expect(Array.isArray(registered)).toBe(true);
		expect(registered.length).toBe(0);
	});

	test('should unregister a string listener', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.on(unique, listener)
				.emit(unique)
				.off(unique, listener)
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(1);
					expect(emitter.listener(unique).length).toBe(0);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should unregister all string listeners when callback-function is omitted', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.on(unique, listener)
				.on(unique, listener)
				.emit(unique)
				.off(unique)
				.emit(unique);

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(2);
					expect(emitter.listener(unique).length).toBe(0);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should unregister an expression listener', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();
			const regex    = new RegExp('^' + unique + '/(?:success|failure)');

			emitter
				.on(regex, listener)
				.emit(unique + '/none')
				.emit(unique + '/success')
				.emit(unique + '/failure')
				.off(regex, listener)
				.emit(unique + '/success');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(2);
					expect(emitter.listener(unique).length).toBe(0);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should unregister all expression listeners when callback-function is omitted', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();
			const regex    = new RegExp('^' + unique + '/(?:success|failure)');

			emitter
				.on(regex, listener)
				.on(regex, listener)
				.emit(unique + '/none')
				.emit(unique + '/success')
				.emit(unique + '/failure')
				.off(regex)
				.emit(unique + '/success');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(4);
					expect(emitter.listener(unique).length).toBe(0);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should unregister an array of event listeners', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();

			emitter
				.on([ unique + '-1', unique + '-2' ], listener)
				.emit(unique + '-1')
				.off([ unique + '-1', unique + '-2' ], listener)
				.emit(unique  + '-2');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(1);
					expect(emitter.listener(unique).length).toBe(0);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should not unregister expression listener when removing a string listener', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();
			const regex    = new RegExp('^' + unique + '/(?:success|failure)');

			emitter
				.on(unique + '/success', listener)
				.on(regex, listener)
				.emit(unique + '/success')
				.off(unique + '/success')
				.emit(unique + '/success');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(3);
					expect(emitter.listener(unique + '/success').length).toBe(1);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});

	test('should not unregister a string listener when removing an expression listener', () => {
		return new Promise((resolve, reject) => {
			const emitter  = new Emitter();
			const unique   = (+new Date()).toString();
			const listener = jest.fn();
			const regex    = new RegExp('^' + unique + '/(?:success|failure)');

			emitter
				.on(unique + '/success', listener)
				.on(regex, listener)
				.emit(unique + '/success')
				.off(regex)
				.emit(unique + '/success');

			setTimeout(() => {
				try {
					expect(listener.mock.calls.length).toBe(3);
					expect(emitter.listener(unique + '/success').length).toBe(1);

					resolve();
				} catch(error) {
					reject(error);
				}
			})
		});
	});
});

describe('listener()', () => {
	test('should return an empty array for events without actual listeners', () => {
		const emitter    = new Emitter();
		const registered = emitter.listener((+new Date()).toString());

		expect(Array.isArray(registered)).toBe(true);
		expect(registered.length).toBe(0);
	});

	test('should return an empty array for invalid events', () => {
		const emitter    = new Emitter();
		const registered = emitter.listener(null);

		expect(Array.isArray(registered)).toBe(true);
		expect(registered.length).toBe(0);
	});

	test('should return an array of listeners', () => {
		const emitter  = new Emitter();
		const unique   = (+new Date()).toString();
		const listener = jest.fn();
		const regex    = new RegExp('^' + unique + '$');

		emitter
			.on([ unique, regex, regex, unique ], function() {})
			.on([ unique, regex, regex, unique ], listener)
			.off(unique, listener);

		const registered = emitter.listener(unique);

		expect(Array.isArray(registered)).toBe(true);
		expect(registered.length).toBe(6);
	});

	test('should return an array of correctly ordered listeners', () => {
		const emitter   = new Emitter();
		const unique    = (+new Date()).toString();
		const listeners = [ function one() {}, function two() {}, function three() {} ];

		emitter
			.on(unique, listeners[0])
			.on(unique, listeners[1], true)
			.on(unique, listeners[2], true);

		const registered = emitter.listener(unique);

		expect(Array.isArray(registered)).toBe(true);
		expect(registered).toEqual(listeners.reverse());
	});
});
