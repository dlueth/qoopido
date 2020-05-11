#!/usr/bin/env node

const packages = require('../shared/packages.js');

packages.public.forEach((package) => {
    console.log('=>', package);
});
