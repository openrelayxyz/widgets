var packageJson = require("./package.json");

module.exports = {
  entry: {
    main: './demo.js'
  },
  output: {
    filename: 'demo.js',
    library: packageJson.name.split("/")[1].split("-").join(""),
  }
};
