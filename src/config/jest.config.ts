import type { Config } from '@jest/types';
import { resolve } from 'path';

// Projemizin kök dizinini (movie-api) alalım
const rootDir = resolve(__dirname, '../..');

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [`${rootDir}/src/__tests__/**/*.ts`],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
    coverageDirectory: `${rootDir}/coverage`,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/__tests__/**',
        '!src/**/*.d.ts',
        '!src/config/jest.config.ts'
    ],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    rootDir: rootDir,
};

export default config; 