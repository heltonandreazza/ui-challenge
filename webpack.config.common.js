var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

module.exports = {
    entry: './src/app/main.ts',
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [{
            test: /\.html$/,
            loaders: ['html-loader']
        }, {
            test: /\.css$/,
            loaders: ['raw-loader']
        }],
        exprContextCritical: false //avoid some nasty errors
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/app/assets/style/', to: 'css/' },
        ]),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['css/bootstrap.min.css', 'css/AdminLTE.css', 'css/skin-blue.css', 'css/style.css'],
            append: false
        })
    ]
}