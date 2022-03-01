const path = require('path'); // CommonJS

module.exports = {
  mode: 'development', //mudar para production depois que tudo tiver terminado para ficar com bundle minificado e outras coisas otimizadas
  entry: './frontend/main.js',
  output: {
    path: path.resolve(__dirname, 'public', 'assets', 'js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      exclude: [/node_modules/, /my_notes/],
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      }
    }/*, 
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }*/]
  },
  devtool: 'source-map'/* quando der erro no navegador ele diz onde deu erro no arquivo real e nao no bundle */
};
