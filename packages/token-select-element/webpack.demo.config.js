var packageJson = require("./package.json");

module.exports = {
  entry: {
    main: './demo.js'
  },
  output: {
    filename: 'demo.js',
    library: packageJson.name.split("/")[1].split("-").join(""),
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       exclude: /node_modules/,
  //       use: {
  //         loader: 'babel-loader',
  //         options: {
  //           presets: ['@babel/preset-env'],
  //           plugins: [
  //             require('@babel/plugin-proposal-object-rest-spread'),
  //             require('@babel/plugin-proposal-export-default-from')
  //           ]
  //         }
  //       }
  //     }
  //   ]
  // }
};
