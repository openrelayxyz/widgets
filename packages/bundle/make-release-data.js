let path = require("path");
let fs = require("fs");
let crypto = require("crypto");


let bundle = fs.createReadStream(path.join(path.dirname(__filename), "./dist/bundle.js"));
const hash = crypto.createHash('sha256');
bundle.on('data', (chunk) => {
  hash.update(chunk);
})
bundle.on('end', () => {
  let digestData = hash.digest("base64")
  let outputYaml = fs.createWriteStream(path.join(path.dirname(__filename), "./dist/release.yml"));

  outputYaml.write("# This file was automatically generated with ./make-release-data.js\n");
  outputYaml.write(`version: "${process.env["TAG"]}"\n`);
  outputYaml.write(`bundle_checksum: "sha256-${digestData}"\n`);
})
