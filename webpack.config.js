// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const prod = process.env.NODE_ENV === 'production';

const config = {
    mode: prod ? 'production' : 'development',
    entry: './Componente.jsx',
    output: {
        filename: '[name].[contenthash].js',
        path: `${__dirname}/dist`,
    },
    resolve: { extensions: ['.js', '.jsx'] },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: [
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-proposal-class-properties',
                        prod ? '@babel/plugin-transform-react-inline-elements' : {},
                        prod ? 'transform-remove-console' : {}
                    ],
                    cacheDirectory: true
                }
            },
            exclude: /node_modules/
        }, {
            test: /\.s?css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        sourceMap: !prod,
                        localIdentName: '[path][name]__[local]--[hash:base64:5]'
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: [
                            require('precss')(),
                            require('autoprefixer')()
                        ]
                    }
                }
            ]
        }, {
            test: /\.(jpe?g|png|gif|eot|woff2?|ttf|svg)$/,
            use: [{
                loader: 'file-loader',
                options: { name: prod ? 'assets/[hash].[ext]' : 'assets/[name].[hash].[ext]' }
            }]
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({ template: './index.html' }),
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};

if (!prod) {
    config.devtool = 'inline-source-map';
}

console.log('prod', prod);
module.exports = config;