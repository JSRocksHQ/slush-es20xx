require('gulp-6to5/node_modules/6to5/polyfill');

import world from './lib/world';

// jscs:disable disallowSpacesInsideParentheses
console.log(`hello ${world}`);
// jscs:enable disallowSpacesInsideParentheses

export {x} from './lib/world'; // jshint ignore: line
