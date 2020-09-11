const path = require('path');
const { merge } = require('webpack-merge');
const commons = require('./webpack.commons.js');

module.exports = merge(commons, {
  mode: 'development',
  entry: './src/index.test.js',
  devtool: 'source-map',
  output: {
    filename: 'bundle-test.js',
    path: path.resolve(__dirname, 'dist')
  }
});
