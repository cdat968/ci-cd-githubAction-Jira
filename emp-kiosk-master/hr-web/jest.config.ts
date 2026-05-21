import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    setupFiles: ["<rootDir>/jest.setup.ts"],
    testMatch: ["**/__tests__/**/*.test.ts"],
    reporters: ["default"],
};

export default config;
