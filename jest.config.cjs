// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['**/tests/import/**/*.integration.test.ts'], // Exclude integration tests
  moduleNameMapper: {
    '^(src/.+).js$': '<rootDir>/$1.ts',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.ts'],
};
