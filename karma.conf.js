var path = require('path');
var webpack = require('./webpack.config.dev');

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'test/main.js',
        ],
        exclude: [],
        preprocessors: {
            'test/main.js': ['webpack', 'sourcemap']
        },
        webpack: require('./webpack.config.dev'),
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    })
}