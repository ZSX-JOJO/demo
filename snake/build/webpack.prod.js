const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const glob = require('glob-all');
const PurifyCSS = require('purifycss-webpack');
let pathhhhh = [
  path.join(__dirname,  'src/page/**/*.html'),
  path.join(__dirname,  'src/page/**/*.js'),
  path.join(__dirname,  'src/lib/*.js')
]
console.log(pathhhhh)

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    // 分析打包结构
    new BundleAnalyzerPlugin(
      {
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info'
      }
    ),
    // 提取css为独立文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css'
    }),
    new PurifyCSS({
      paths: glob.sync(pathhhhh)//src下所有的html
    }),
    // js代码精简压缩
    new UglifyJSPlugin({
      sourceMap: true
    }),
    // 设置环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  module: {
    rules: [
      {
        // 匹配 css 文件
        test: /\.css$/,
        // 打包时分离css文件
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../' 
            }
          }, 
          {
            loader: 'css-loader',
            options: {}
          },
          {
            loader: 'postcss-loader',
            options: {}
          }
        ]
      },
    ]
  }
});
