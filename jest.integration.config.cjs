// jest.integration.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['**/tests/**/*.integration.test.ts'], // Only run integration tests
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
    coverageDirectory: './coverage/integration',
    collectCoverageFrom: ['src/**/*.ts'],
  };
  