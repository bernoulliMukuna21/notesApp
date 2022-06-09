var rootDir = process.cwd();

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/**/*.test.ts"],
  setupFilesAfterEnv: [`${rootDir}/src/__tests__/setupTests.ts`],
  verbose: true,
  forceExit: true,
  testTimeout: 1000000
};