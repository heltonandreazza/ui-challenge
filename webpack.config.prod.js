var path = require('path');

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.config.common');

//merge common with prod config
module.exports = webpackMerge(commonConfig, {
    entry: './src/app/main.aot.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[hash].js',
        chunkFilename: '[id].[hash].chunck.js' //chunks for lazy loading ramdom generated [hash] to make sure there is no cached lazy loaded pages
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: [
                { loader: 'awesome-typescript-loader' },
                { loader: 'angular2-template-loader' },
                { loader: 'angular-router-loader?aot=true' }
            ]
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
})