module.exports = {
    "hooks": {
        "pre-commit": "lint-staged --config ./.lintstagedrc.js && yarn test:coverage",
        "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
}
