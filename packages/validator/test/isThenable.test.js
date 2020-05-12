const { isThenable } = require('../dist/index');

describe('isRegExp()', () => {
	test('should return true for thenables', () => {
        function Thenable() {
            this.then = function() {};
        }

        expect(isThenable(Promise.resolve())).toBe(true);
        expect(isThenable(new Thenable())).toBe(true);
	});

    test('should return false for non-thenables', () => {
        expect(isThenable()).toBe(false);
        expect(isThenable({})).toBe(false);
        expect(isThenable('string')).toBe(false);
        expect(isThenable(Number.NaN)).toBe(false);
    });
});
