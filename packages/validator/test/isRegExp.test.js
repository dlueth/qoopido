const isRegExp = require('../dist/isRegExp');

describe('isRegExp()', () => {
	test('should return true for RegExps', () => {
        expect(isRegExp(/^test/)).toBe(true);
        expect(isRegExp(new RegExp('^test'))).toBe(true);
	});

    test('should return false for non-RegExps', () => {
        expect(isRegExp('test')).toBe(false);
    });
});
