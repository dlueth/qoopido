import { isArray, isRegExp, isString } from "@qoopido/validator";

/**
 * Check if identifier is of valid tye
 *
 * @param {*} identifier
 *
 * @returns {Boolean}
 */
function isIdentifier(identifier) {
	return isString(identifier) || isRegExp(identifier) || isArray(identifier);
}

export { isIdentifier };
