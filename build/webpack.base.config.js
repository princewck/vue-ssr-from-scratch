'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
const isLocal = process.env.NODE_ENV === 'local';
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const px2rem = require('postcss-pxtorem')

const pkg = require('../package.json');

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ],
        flexbox: 'no-2009',
      }),
      px2rem({
        rootValue: 16,
        propWhiteList: [],
        minPixelValue: 2,
      })
    ],
  },
};


module.exports = {
  mode: isProd ? 'production' : 'development',
  bail: true,
  stats: {
    children: false, // 阻止插件打印信息
  },
  context: path.join(__dirname, '..'),
  // entry: {
  //   app: [
  //     require.resolve('babel-polyfill'),
  //     path.resolve(__dirname, `../src/main.js`),
  //   ],
  // },
  devtool: isProd ? '' : 'source-map',
  devServer: {
    contentBase: path.join(__dirname, `../dist/`),
    compress: true,
    port: 3006,
    host: '0.0.0.0',
    quiet: false,
    historyApiFallback: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.vue'],
    alias: {
      '@': path.join(__dirname, '../src'),
      'vue': 'vue/dist/vue.js'
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, '../src'),
        use: [{
          loader: 'babel-loader',
        }],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        exclude: [
          /\.ejs$/,
          /\.html$/,
          /\.(js|jsx)(\?.*)?$/,
          /\.(ts|tsx)(\?.*)?$/,
          /\.css$/,
          /\.s(c|a)ss$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.json$/,
          /\.svg$/,
          /\.vue$/
        ],
        loader: 'file-loader',
        options: {
          name: isLocal ? 'public/media/[name].[ext]' : 'assets/[name].[hash:10].[ext]',
        },
      },
      {
        test: [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
        loader: 'url-loader',
        options: {
          limit: 81920, // 10k
          name: isLocal ? 'public/media/images/[name].[hash].[ext]' : 'assets/[name].[hash:10].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: [
          isLocal ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          }, postcssLoader ],
      },
      {
        test: /\.scss$/,
        use: [
          isLocal ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          }, postcssLoader, 'sass-loader' ],
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
      },
    ],
  },
  // Avoid using CommonsChunkPlugin in the server config.
  // optimization: {
    // splitChunks: {
    //   chunks: 'all',
    //   name: true,
    //   cacheGroups: {
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendor',
    //     },
    //   },
    // },
    // runtimeChunk: {
    //   name: 'manifest',
    // },
  // },
  plugins: [
    new ManifestPlugin({
      writeToFileEmit: true,
      fileName: 'assets-manifest.json',
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `../src/index.ejs`),
      minify: isProd,
    }),
    ...(!isLocal ? [
      new MiniCssExtractPlugin({
        filename: `assets/[name].[chunkhash:10].css`,
      })
    ] : [])
  ],
};