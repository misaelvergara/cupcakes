module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage/backend',
  collectCoverageFrom: [
    'bakery/**/*.js',
    '!bakery/**/*.test.js',
    '!bakery/**/*.spec.js',
    '!bakery/cupcakes.db'
  ],
  testMatch: [
    '**/bakery/**/*.test.js',
    '**/bakery/**/*.spec.js'
  ],
  verbose: true
};
