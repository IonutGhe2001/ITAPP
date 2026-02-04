module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(test).[tj]s"],
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", {
      tsconfig: "tsconfig.test.json",
      diagnostics: false,
    }],
  },
  moduleNameMapper: {
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^@validators/(.*)$": "<rootDir>/src/validators/$1",
    "^@shared/(.*)$": "<rootDir>/../shared/$1",
  },
};
