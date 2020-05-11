#!/usr/bin/env node

const locations = require('../shared/locations.js');

locations.public.forEach((location) => {
    console.log('=>', location);
});
