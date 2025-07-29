module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).[tj]s'],
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@validators/(.*)$': '<rootDir>/src/validators/$1',
  },
};