const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractCSS = new ExtractTextPlugin("app.css");
const webpack = require("webpack");

const config = {
    devServer: {
        historyApiFallback: true,
        contentBase: "./",
        host: "0.0.0.0",
        inline: true,
        port: 3002
    },
    mode: "development",
    devtool: "source-map",
    entry: ["babel-polyfill", "./src/"],
    resolve: {
        extensions: [".js", ".jsx", ".css", ".scss"]
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use:{
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                },
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                use: "url-loader?limit=5120&name=./images/[hash].[ext]"
            },
            {
                test: /\.(mp3)$/,
                use: "file-loader"
            },
            {
                test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                use: "file-loader"
            }
        ]
    },
    plugins: [
        ExtractCSS,
        new HtmlWebpackPlugin({
            title: "React App",
            template: "index.ejs",
            hash: true
        }),
        new webpack.ProgressPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;
