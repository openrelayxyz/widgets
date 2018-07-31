var packageJson = require("./package.json");

module.exports = {
  entry: {
    main: './index.js'
  },
  output: {
    filename: 'bundle.js',
    library: packageJson.name.split("/")[1].split("-").join(""),
  }
};
