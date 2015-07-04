import universe, {star} from './lib/universe';

console.log(`
	hello world!
	The answer to the universe is ${universe}.
`);


// For your code to be 100% portable,
// import the built-in prototype methods you need from `babel-runtime/core-js`
// and apply them with `::` instead of `.`, for example:
import core from 'babel-runtime/core-js';
const {repeat, includes} = core.String.prototype;

const fiveStars = star::repeat(5);
const hasTwoStars = fiveStars::includes('**');


// Static methods of the built-in constructors are automatically imported when you use them:
const mergedObject = Object.assign({a: 1}, {b: 2});


export {fiveStars, hasTwoStars, mergedObject};
