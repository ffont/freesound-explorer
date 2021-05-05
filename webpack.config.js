const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const jsonImporter = require('node-sass-json-importer');
// const sassVars = require('@epegzz/sass-vars-loader')

function getEntrySources(sources) {
  if (process.env.NODE_ENV === 'flask') {
    sources.unshift('react-hot-loader/patch');
    sources.push('webpack-dev-server/client?http://localhost:8080');
  } else if (process.env.NODE_ENV !== 'production') {
    sources.unshift('react-hot-loader/patch');
    sources.push('webpack-hot-middleware/client');
  }
  return sources;
}

// function getPlugins(plugins) {
//   if (process.env.NODE_ENV !== 'production') {
//     plugins.push(new webpack.HotModuleReplacementPlugin());
//   }
//   if (process.env.NODE_ENV === 'production') {
//     plugins.push(new webpack.optimize.UglifyJsPlugin({
//       sourceMap: false,
//       mangle: false,
//     }));
//   }
//   return plugins;
// }

module.exports = {
  devtool: (process.env.NODE_ENV !== 'production') ? 'eval' : '',
  entry: getEntrySources([
    './src/index.jsx',
  ]),
  output: {
    path: path.join(__dirname, 'static/js/'),
    filename: 'bundle.js',
    publicPath: '/static/js/',
  },
  optimization: {
    minimize: true,
  },
  // plugins: getPlugins([
  //   new webpack.DefinePlugin({
  //     'process.env': {
  //       NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  //     },
  //   }),
  // ]),
  module: {
    rules: [
      // {
      //   test: /\.js?$/,
      //   use: ['babel-loader'],
      //   exclude: /node_modules/,
      //   include: path.resolve(__dirname, 'src'),
      // },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          'postcss-loader',
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
              sassOptions: {
                importer: jsonImporter,
              }
            },
          },
        ],
        include: [
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'src/stylesheets'),
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(ttf|eot|png|jpg|svg)(\?.*$|$)$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
    ],
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.scss']
  //   enforceExtension: true,
  // },
  // postcss() {
  //   return [autoprefixer, precss];
  },
}

