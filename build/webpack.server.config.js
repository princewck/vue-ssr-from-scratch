const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
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
  entry: path.resolve(__dirname, '../src/entry-server.js'),

  target: 'node',

  devtool: 'source-map',

  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, `../app/ssr-bundle`),
    filename: 'assets/[name].[chunkhash:10].js',
    publicPath: '/',
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: [
    new VueSSRServerPlugin(),
  ]
});

