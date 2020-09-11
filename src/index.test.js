require('angular');
require('angular-mocks/angular-mocks.js');
require('./lib/module.js');

// require all test files using special Webpack feature
// https://webpack.github.io/docs/context.html#require-context
const testsContext = require.context('.', true, /\.spec$/);

testsContext.keys().forEach(testsContext);
