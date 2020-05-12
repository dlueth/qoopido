const { isInstanceof } = require('../dist/index');

describe('isIntanceof()', () => {
	test('should return true if matching', () => {
	    const test = new Error();

        expect(isInstanceof(test, Error)).toBe(true);
	});

    test('should return false for non-matching', () => {
        const test = 'test';

        expect(isInstanceof(test, Error)).toBe(false);
    });
});
