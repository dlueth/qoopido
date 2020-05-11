const { execSync } = require('child_process');

const filtered = {};

let packages;

function Locations() {
	packages = JSON.parse(execSync('lerna ls --json').toString())
}

Locations.prototype = {
	get all() {
		return filtered.all || (filtered.all = packages.map(entry => entry.location));
	},
	get public() {
		return filtered.public || (filtered.public = packages.filter(entry => !!entry.private === false).map(entry => entry.location));
	},
	get private() {
		return filtered.private || (filtered.private = packages.filter(entry => !!entry.private === true).map(entry => entry.location));
	}
};

module.exports = new Locations();
