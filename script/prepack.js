#!/usr/bin/env node

const locations = require('../shared/locations.js');

locations.public.forEach((location) => {
    const pkg = require(location + '/package.json');
    console.log('=>', location, pkg);
});
