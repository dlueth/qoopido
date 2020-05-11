#!/usr/bin/env node

const locations = require('../shared/paths.js');

locations.public.forEach((location) => {
    console.log('=>', location);
});
