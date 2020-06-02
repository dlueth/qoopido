#!/usr/bin/env node

const fs = require('fs');
const locations = require('../shared/locations.js');

locations.public.forEach((location) => {
    const pkg = require(location + '/package.json');

    pkg.main   = pkg.main.replace(/^dist\//, '');
    pkg.module = pkg.module.replace(/^dist\//, '');

    delete pkg.scripts;

    fs.writeFileSync(location + '/dist/package.json', JSON.stringify(pkg, null, 4));
    fs.copyFileSync(location + '/README.md', location + '/dist/README.md');
    fs.copyFileSync(location + '/../../LICENSE', location + '/dist/LICENSE');
});
