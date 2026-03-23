/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^next-intl$": "<rootDir>/__mocks__/next-intl.ts",
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "lib/**/*.ts",
    "components/**/*.ts",
    "components/**/*.tsx",
    "!**/__tests__/**",
  ],
};
