export default {
  "presets": [
    ["@babel/preset-env", { 
      "modules": false,
      "targets": {
        "browsers": ["last 2 versions", "not ie <= 11"]
      }
    }], 
    "@babel/preset-react", 
    "@babel/preset-typescript"
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "useESModules": true
    }],
    ["babel-plugin-add-import-extension", { 
      "extension": "js" 
    }]
  ],
}
