/**! @qoopido/validator 1.0.0 | https://github.com/dlueth/qoopido | (c) 2020 Dirk Lueth */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global['@qoopido/validator'] = {}));
}(this, (function (exports) { 'use strict';

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

	exports.isArray = isArray;
	exports.isFunction = isFunction;
	exports.isInstanceof = isInstanceof;
	exports.isRegExp = isRegExp;
	exports.isString = isString;
	exports.isThenable = isThenable;
	exports.isTypeof = isTypeof;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
