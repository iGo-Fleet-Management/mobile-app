module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['module:react-native-dotenv'],
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-private-property-in-object'
    ],
    env: {
      test: {
        plugins: [
          '@babel/plugin-transform-class-properties',
          '@babel/plugin-transform-private-methods',
          '@babel/plugin-transform-private-property-in-object'
        ]
      }
    }
  };
};