module.exports = {
    "hooks": {
        "pre-commit": "lint-staged --config ./.lintstagedrc.js && yarn test:coverage",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
}
