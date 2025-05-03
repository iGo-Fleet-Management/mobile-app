module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-navigation|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|socket.io-client)'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/setupTests.js'
  ],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js'
  ],
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/svgMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    // Mapeamento específico para a imagem do logo
    "\\.\\.\/\\.\\.\/\\.\\.\/assets\/images\/Logo iGo.png": "<rootDir>/__mocks__/fileMock.js",
    // Versão alternativa com outro formato de escape
    "../../../assets/images/Logo iGo.png": "<rootDir>/__mocks__/fileMock.js",
  },
}