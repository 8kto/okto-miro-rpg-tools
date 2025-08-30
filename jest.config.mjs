/** @type {import("jest").Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleNameMapper: {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat",
    "^react/jsx-runtime$": "preact/jsx-runtime",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$": "<rootDir>/test/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
}
