module.exports = {
  entry: './src/index.js',
  output: {
    filename: './tree-utils.min.js',
    library: 'treeUtils',
    libraryTarget: 'window'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/
      }
    ]
  }
};
