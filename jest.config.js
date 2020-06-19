module.exports = {
    verbose: true,
    projects:
    [
            "<rootDir>/packages/*/jest.config.js"
    ],
    moduleNameMapper: {
        "@qoopido/(.+)$": "<rootDir>/packages/$1/src",
    },
    modulePathIgnorePatterns: [
        "dist/",
    ],
    testMatch: [ `<rootDir>/packages/*/src/**/*.test.js` ],
    collectCoverageFrom: [
        `<rootDir>/packages/*/src/**/*.js`,
        `!<rootDir>/packages/*/src/**/*.test.js`
    ],
    coverageDirectory: "<rootDir>/coverage/",
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    },
    transform: {
        "^.+\\.js$": "babel-jest"
    },
};
