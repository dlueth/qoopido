const { isString } = require('../dist/index');

describe('isString()', () => {
	test('should return true for strings', () => {
        expect(isString('test')).toBe(true);
        expect(isString(new String('test'))).toBe(true);
	});

    test('should return false for non-strings', () => {
        expect(isString({})).toBe(false);
    });
});
