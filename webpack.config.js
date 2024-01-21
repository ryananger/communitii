const path = require("path");
const Dotenv = require('dotenv-webpack');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./client/src/index.jsx",
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: "bundle.js"
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  },
  optimization: {
    minimize: false
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.(png)$/,
        type: 'asset/resource'
      }
    ]
  },
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, 'client/dist'),
    },
    compress: false,
    port: 9000,
  },

  plugins: [
    new Dotenv(),
    new CompressionPlugin({})
  ]
}
