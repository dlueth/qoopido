/**! @qoopido/validator 1.0.0 | https://github.com/dlueth/qoopido | (c) 2020 Dirk Lueth */
/**
 * Check if value is of a certain type
 *
 * @param {*} value
 * @param {string} type
 *
 * @returns {Boolean}
 */
function isTypeof(value, type) {
	return typeof value === type;
}

/**
 * Check if value is of a certain type
 *
 * @param {*} value
 * @param {*} constructor
 *
 * @returns {Boolean}
 */
function isInstanceof(value, constructor) {
	return value instanceof constructor;
}

/**
 * Check if value is a function
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
function isFunction(value) {
	return isTypeof(value, "function");
}

/**
 * Check if value is a string
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
function isString(value) {
	return isTypeof(value, "string") || isInstanceof(value, String);
}

/**
 * Check if value is an array
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
function isArray(value) {
	return Array.isArray(value);
}

/**
 * Check if value is a RegExp
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
function isRegExp(value) {
	return isInstanceof(value, RegExp);
}

/**
 * Check if value is thenable
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
function isThenable(value) {
	return value && isFunction(value.then);
}

export { isArray, isFunction, isInstanceof, isRegExp, isString, isThenable, isTypeof };
//# sourceMappingURL=index.js.map
