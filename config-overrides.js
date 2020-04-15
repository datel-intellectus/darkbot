const {
    override,
    addExternalBabelPlugin
  } = require("customize-cra");

module.exports = override(
    addExternalBabelPlugin([
        "@babel/plugin-transform-typescript",
        { allowNamespaces: true }
    ])
);
