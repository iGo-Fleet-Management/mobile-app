module.exports = {
    testEnvironment: 'node',
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.js'],
    coverageDirectory: 'coverage',
    moduleNameMapper: {
      '^@services/(.*)$': '<rootDir>/src/services/$1',
    },
  };
  