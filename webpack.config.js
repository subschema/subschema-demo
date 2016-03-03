"use strict";
var webpack = require('webpack');
var path = require('path'), join = path.join.bind(path, __dirname);
var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

var lifecycle = process.env['npm_lifecycle_event'];
var isPrepublish = lifecycle === 'prepublish' || lifecycle == 'dist' || lifecycle == 'demo';
var isKarma = process.env['NODE_ENV'] === 'test';
var isTestDist = lifecycle === 'test-dist';
var subschema =
    //join('../subschema/dist/subschema-noreact.js');
    //join('node_modules/subschema/dist/subschema-noreact.js');
    join('../subschema/src');
var subschemaProject = join('../', 'subschema-project');
var subschemaTest = join('../', 'subschema-test-support');

module.exports = {
    devtool: (isPrepublish ? '#source-map' : "#inline-source-map"),
    devServer: {
        noInfo: false,
        hot: true,
        inline: true,
        contentBase: join('public'),
        publicPath: '/',
        port: 8082
    },
    resolve: {
        extensions: ['', '.jsx', '.js'],
        alias: {
            'fbjs': join('node_modules/fbjs'),
            'react': join('node_modules/react'),
            'react-dom': join('node_modules/react-dom'),
            'ReactDOM': join('node_modules/react-dom'),

            'react-addons-css-transition-group': join('node_modules/react-addons-css-transition-group'),
            'Subschema': subschema,
            subschema: path.join(subschema, '..'),
            'subschema-project': path.join(subschemaProject, 'src/index.js'),
            'subschema-test-support': path.join(subschemaTest,'index'),
            'component-playground': join('node_modules/component-playground/src'),
            //'subschema-styles': join('node_modules/subschema/src/styles'),
            'subschema-demo': isTestDist ? join('dist/index.js') : join('src/index.js')
        }
    },
    stats: {
        colors: true,
        reasons: true
    },
    module: {
        extensions: ['', '.jsx', '.js'],
        loaders: [
            {
                test: /\.tmpl$/,
                loader: path.join(subschemaProject, 'tmpl-loader'),
                include: [
                    path.join(subschemaProject, 'src')
                ]
            },
            {
                test: /.*-setup.jsx?$/,
                loader: '!!raw!',
                include: [
                    path.join(subschemaTest, 'samples')
                ]
            },
            {
                test: /\.jsx?$/,
                //do this to prevent babel from translating everything.
                loader: 'babel',
                exclude: [
                    /babel/,
                    /babelyon/,
                    /codemirror/,
                    /babylon/
                ],
                include: [
                    /subschema/,
                    subschemaTest,
                    path.join(subschemaProject, 'src'),
                    join('src'),
                    join('public'),
                    join('node_modules/component-playground/src'),
                    isKarma ? join('test') : join('no_such_dir')
                ]
            },

            {test: /\.(png|jpe?g|mpe?g[34]?|gif)$/, loader: 'url-loader?limit=100000'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"},
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loader: 'style!css!' + AUTOPREFIXER_LOADER
            },

            {
                test: /\.less$/,
                loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less'
            }]

    },
    plugins: [
        new webpack.ProvidePlugin({
            CodeMirror: "codemirror",
            "window.CodeMirror": "codemirror"
        })
    ]
};
