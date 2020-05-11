const { isArray } = require('../dist/umd/index');

describe('isArray()', () => {
	test('should return true for arrays', () => {
        expect(isArray([])).toBe(true);
	});

    test('should return false for non-arrays', () => {
        expect(isArray()).toBe(false);
        expect(isArray(null)).toBe(false);
        expect(isArray({})).toBe(false);
        expect(isArray('test')).toBe(false);
        expect(isArray(function() {})).toBe(false);
    });
});
