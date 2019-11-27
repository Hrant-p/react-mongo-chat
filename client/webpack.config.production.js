const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', './src'],
  devtool: '',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        }, 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            minimize: true,
          },
        }],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 5120,
          name: '[hash].[ext]',
          outputPath: '/images/',
        },

      },
      {
        test: /\.(mp3)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[hash].[ext]',
        },
      },
    ],
  },
  output: {
    chunkFilename: 'js/[name]-chunk_[chunkhash].js',
    filename: 'js/[name]_[chunkhash].js',
    path: `${__dirname}/public`,
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['./public'] }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      mode: process.env.NODE_ENV,
      title: 'React App',
      template: 'index.ejs',
      hash: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-chunk_[chunkhash].css',
      chunkFilename: 'css/[name]-chunk_[chunkhash].css',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ],
};
