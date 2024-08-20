export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    // Resolve your project's .js imports to .ts files during testing
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
