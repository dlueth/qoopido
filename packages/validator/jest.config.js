const base     = require("../../jest.config.js");
const { name } = require("./package");

const dir = name.substr(name.indexOf('/') + 1);

module.exports = {
    ...base,
    displayName: name,
    name: name,
    rootDir: "../..",
    projects: undefined,
    testMatch: [ `<rootDir>/packages/${dir}/src/**/*.test.js` ],
    collectCoverageFrom: [
        `<rootDir>/packages/${dir}/src/**/*.js`,
        `!<rootDir>/packages/${dir}/src/**/*.test.js`
    ],
    setupFiles: [
        ...base.setupFiles,
        `<rootDir>/packages/${dir}/jest.setup.js`
    ]
};
