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
     }
 }