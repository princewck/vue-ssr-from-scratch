const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const path = require('path');

// let publicPath;
// switch(process.env.NODE_ENV) {
//   case 'local':
//     publicPath = 'https://flow.cbndata.local:3006/';
//     break;
//   case 'production':
//     publicPath = `//assets.cbndata.org/${pkg.name}/${pkg.version}/`;
//     break;
//   default:
//     publicPath = `//pandora.cbndata.org/${pkg.name}/${pkg.version}/`;
//     break;
// }

module.exports = merge(baseConfig, {
  entry: path.resolve(__dirname, '../src/entry-client.js'),

  target: 'web',

  devtool: 'source-map',

  output: {
    path: path.join(__dirname, `../dist`),
    filename: 'assets/[name].[chunkhash:10].js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
  plugins: [
    new CleanWebpackPlugin([ `dist` ], {
      root: path.join(__dirname, '../'),
    }),
    new VueSSRClientPlugin(),
  ]
});

