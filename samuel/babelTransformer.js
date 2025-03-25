const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [
    'module:metro-react-native-babel-preset'
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining'
  ],
  babelrc: false,
  configFile: false
});