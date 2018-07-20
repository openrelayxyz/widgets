import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import packageJson from "./package.json";


export default {
  input: 'index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: packageJson.name.split("/")[1].split("-").join(""),
  },
  plugins: [
    builtins(),
    json(),
    resolve(),
    commonjs(),
  ]
};
