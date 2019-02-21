const path = require("path");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");

/** @type {webpack.Configuration} */
module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  entry: {
    app: "./src/main.ts",
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
  },
  output: {
    globalObject: "self",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  target: 'web',
  node: {
      fs: 'empty',
      child_process: 'empty',
      net: 'empty',
      crypto: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              root: __dirname
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: "./src/index.html"
    })
  ],
  devServer: {}
};
