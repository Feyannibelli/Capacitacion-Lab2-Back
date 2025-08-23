import type { Config } from 'jest';

const config: Config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: { '^.+\\.(t|j)s$': 'ts-jest' },

    collectCoverageFrom: [
        'src/**/service/**/*.ts',
    ],
    coverageDirectory: './coverage',
    coverageThreshold: {
        global: { branches: 80, functions: 80, lines: 80, statements: 80 },
    },
};

export default config;
