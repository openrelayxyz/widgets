let path = require("path");
let fs = require("fs");
let packageDir = path.resolve(path.dirname(__filename) + "/..");

let packages = fs.readdirSync(packageDir);
let packageNames = [];
let indexFile = fs.createWriteStream(path.join(path.dirname(__filename), "index.js"));
indexFile.write("// This file was automatically generated with ./make-index.js\n");

indexFile.once("open", () => {
  for(let pkg of packages) {
    if(pkg == "bundle" || pkg == "test-utils") { continue; }
    let pkgJson = require(`../${pkg}/package.json`);
    indexFile.write(`import '${pkgJson.name}';\n`);
  }
  indexFile.end();
})
