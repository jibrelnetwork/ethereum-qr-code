const webpack = require('webpack')

const { version } = require('./package.json')

const banner = `
  Ethereum adress QR Code generator
  v ${version} - ${new Date().toString()}
  https://github.com/jibrelnetwork/ethereum-qr-code
  file:[file]
`

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'build/ethereum-qr-code.js',
    library: 'EthereumQRPlugin',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [
    new webpack.BannerPlugin({ banner }),
  ],
}