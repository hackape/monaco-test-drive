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
    app: "./src/index.js",
    // Package each language's worker and give these filenames in `getWorkerUrl`
    // "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    // "json.worker": "monaco-editor/esm/vs/language/json/json.worker",
    // "css.worker": "monaco-editor/esm/vs/language/css/css.worker",
    // "html.worker": "monaco-editor/esm/vs/language/html/html.worker",
    // "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker",
    // "fe.worker": "./src/language/fe/fe.worker",
  },
  output: {
    globalObject: "self",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
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
