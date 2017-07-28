
module: {
  loaders: [{
    test: /\.js$/,
    loaders: ['react-hot', 'babel'],
    include: path.join(__dirname, 'src')
  },
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel',
    query: {
      presets: ['es2015', 'react', 'stage-1' ]
    }
  },
  {
    test: /\.scss$/,
    loaders: ['style', 'css', 'sass']
  },
  {
    test: /\.css$/,
    loaders: ['style', 'css', 'sass']
  },
  { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file?name=./img/[name]-[hash].[ext]" },
  { test: /\.(jpg|png|gif)$/, loader: 'file?name=./img/[name]-[hash].[ext]' },
    {
      test: /\.(ttf|eot|woff2|woff|ttf|svg|woff(2)?)(\S+)?$/,
      loader: 'file-loader?name=[name].[ext]'
    },
],
}
