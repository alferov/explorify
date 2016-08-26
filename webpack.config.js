module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'github-showcasify.js'
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'stage-0'],
        plugins: [
          'transform-runtime',
          'transform-regenerator'
        ]
      }
    }]
  }
}
