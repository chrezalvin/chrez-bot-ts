const tsconfig = require('./tsconfig2.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleNameMapper: {
    ...moduleNameMapper
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};