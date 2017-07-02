var path = require('path');

var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.config.common');

//merge common with this dev config
module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
        chunkFilename: '[id].chunck.js' //chunks for lazy loading
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: 'awesome-typescript-loader',
                options: {
                    transpileOnly: true // to not analized all .ts files avoiding problems for AOT compilatio
                }
            }, {
                loader: 'angular2-template-loader'
            }, {
                loader: 'angular-router-loader'
            }]
        }]
    },
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
})