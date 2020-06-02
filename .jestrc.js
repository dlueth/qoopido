module.exports = {
    verbose: true,
    coveragePathIgnorePatterns: [
        "<rootDir>/config",
        "<rootDir>/coverage",
        "<rootDir>/node_modules",
        "<rootDir>/temp"
    ],
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    }
};
