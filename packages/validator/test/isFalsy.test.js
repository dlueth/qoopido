const { isFalsy } = require('../dist/index');

describe('isFalsy()', () => {
	test('should return true for falsy values', () => {
        expect(isFalsy()).toBe(true);
        expect(isFalsy(false)).toBe(true);
        expect(isFalsy(0)).toBe(true);
        expect(isFalsy(null)).toBe(true);
        expect(isFalsy(undefined)).toBe(true);
        expect(isFalsy(void 0)).toBe(true);
        expect(isFalsy('')).toBe(true);
        expect(isFalsy(Number.NaN)).toBe(true);
        expect(isFalsy(new String())).toBe(true);
        expect(isFalsy(String())).toBe(true);
	});

    test('should return false for non-falsy values', () => {
        expect(isFalsy(true)).toBe(false);
        expect(isFalsy('test')).toBe(false);
        expect(isFalsy(1)).toBe(false);
        expect(isFalsy({})).toBe(false);
        expect(isFalsy([])).toBe(false);
        expect(isFalsy(function() {})).toBe(false);
    });
});
