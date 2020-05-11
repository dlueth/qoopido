const { isThenable } = require('../dist/umd/index');

describe('isRegExp()', () => {
	test('should return true for thenables', () => {
        function Thenable() {
            this.then = function() {};
        };

        expect(isThenable(Promise.resolve())).toBe(true);
        expect(isThenable(new Thenable())).toBe(true);
	});

    test('should return false for non-thenables', () => {
        expect(isThenable({})).toBe(false);
    });
});
