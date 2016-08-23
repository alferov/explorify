module.exports = {
  entry: __dirname + '/src/github-extended-newsfeed.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
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
