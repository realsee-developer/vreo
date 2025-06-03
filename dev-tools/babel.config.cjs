module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "modules": false,
      "targets": {
        "node": "16",
        "browsers": ["last 2 versions", "ie >= 11"]
      }
    }], 
    "@babel/preset-react", 
    "@babel/preset-typescript"
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "useESModules": true
    }]
  ],
}
