module.exports = {
    verbose: true,
    projects: [
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
    setupFiles: [
        `<rootDir>/jest.setup.js`
    ],
    coverageDirectory: "<rootDir>/coverage/",
    coverageThreshold: {
        global: {
            statements: 50,
            branches: 50,
            functions: 50,
            lines: 50
        }
    },
    transform: {
        "^.+\\.js$": "babel-jest"
    },
};
