// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/tests/.*\\.integration\\.test\\.ts$'], // Corrected pattern to ignore integration tests
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
