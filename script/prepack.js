#!/usr/bin/env node

const packages = require('../shared/paths.js');

packages.public.forEach((package) => {
    console.log('=>', package);
});
