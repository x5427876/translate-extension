/* eslint-disable */

const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const tsRule = {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
}

const plugins = [
    new HTMLWebpackPlugin({
        template: 'src/popup-page/popup.html',
        filename: 'popup.html',
        chunks: ['popup'],
    }),
    new CopyWebpackPlugin({
        patterns: [
            { from: "public", to: "." }
        ],
    }),
    new CleanWebpackPlugin(),
];

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        popup: './src/popup-page/popup.tsx',
        contentscript: './src/contentscript.ts',
        background: './src/background/background.ts',
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dist'),
    },
    module: {
        rules: [tsRule],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins,
}