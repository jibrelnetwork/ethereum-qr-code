
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
     entry: './index.js',
     output: {
         path: __dirname,
         filename: 'build/etherium-qr-code.js',
        library: 'EtheriumQRplugin',
        libraryTarget: 'umd',
        umdNamedDefine: true
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader'
         }]
     },
    plugins: [
        //new UglifyJSPlugin(),
        new webpack.BannerPlugin({
            banner: "Etherium adress QR generator \n https://github.com/jibrelnetwork/ethereum-qr-code \n file:[file]"
        })
    ]
 }