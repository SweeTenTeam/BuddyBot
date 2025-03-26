module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'react-markdown': '<rootDir>/node_modules/react-markdown/lib/index.d.ts',
    'remark-gfm': '<rootDir>/node_modules/remark-gfm/lib/index.d.ts',
    'rehype-highlight': '<rootDir>/node_modules/rehype-highlight/lib/index.d.ts',
    "\\.css$": "identity-obj-proxy",
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      tsconfig: 'tsconfig.jest.json',
      useESM: true,
    }],
    "^.+\\.css$": "jest-transform-stub",
  },
  transformIgnorePatterns: [
     '/node_modules/(?!react-markdown|remark-gfm|rehype-highlight)/',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
};
