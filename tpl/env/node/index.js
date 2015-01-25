///////////////////////
// !! DO NOT EDIT !! //
///////////////////////
//
// This file exists solely to abstract away the polyfills required by 6to5,
// and also to work around a `npm link` issue in Unix-based OS's.
// Put your entry point's logic in the `src/index.js` file.
//

'use strict';

// Apply polyfills at the package's entry point(s)
require('core-js/shim');
require('regenerator/runtime');

// Run the package transpiled's code and re-export its exports
module.exports = require('dist/index.js');
