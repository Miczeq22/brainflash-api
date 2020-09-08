module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      diagnostics: true,
    },
  },
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '@errors/(.*)': '<rootDir>/src/errors/$1',
    '@tools/(.*)': '<rootDir>/src/tools/$1',
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@infrastructure/(.*)': '<rootDir>/src/infrastructure/$1',
    '@api/(.*)': '<rootDir>/src/api/$1',
    '@core/(.*)': '<rootDir>/src/core/$1',
    '@tests/(.*)': '<rootDir>/src/tests/$1',
  },
};
