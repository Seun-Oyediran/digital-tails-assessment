const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: [
    "/node_modules/(?!three)/", // This tells Jest to transform `three` files
  ],
};

module.exports = createJestConfig(customJestConfig);
