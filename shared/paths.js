const { execSync } = require('child_process');

const filtered = {};

let packages;

function Packages() {
	packages = JSON.parse(execSync('lerna ls --json').toString())
    console.log(packages);
}

Packages.prototype = {
	get all() {
		return filtered.all || (filtered.all = packages.map(entry => entry.name));
	},
	get public() {
		return filtered.public || (filtered.public = packages.filter(entry => !!entry.private === false).map(entry => entry.name));
	},
	get private() {
		return filtered.private || (filtered.private = packages.filter(entry => !!entry.private === true).map(entry => entry.name));
	}
};

module.exports = new Packages();
