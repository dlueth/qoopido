module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['ie >= 11']
                },
            }
        ]
    ]
}
