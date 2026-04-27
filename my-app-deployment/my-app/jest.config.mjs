import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/_app.tsx",
    "!src/**/_document.tsx",
    "!src/backup/**",
    "!src/utils/**",
    "!src/middleware/**",
    "!src/middleware.ts",
    "!src/types/**",
    "!src/pages/api/**",
    "!src/views/**",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

export default createJestConfig(config);
