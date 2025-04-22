import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/../__tests__/**/*.ts'],
    collectCoverage: true
};

export default config; 