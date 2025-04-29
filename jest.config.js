/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "/dist/",
      "/tests/"
    ],
    testPathIgnorePatterns: [
      "/node_modules/",
      "/dist/"
    ],
    verbose: true
  };