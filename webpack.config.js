const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const packageJson = require('./package.json');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    // mode: 'development',
    // devtool: 'eval',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            version: packageJson.version,
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/virtual-keyboard.html', to: 'virtual-keyboard.html' },
                { from: 'src/index.css', to: 'index.css' },
            ],
        }),
    ],
}