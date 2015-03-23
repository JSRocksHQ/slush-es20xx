/*eslint-env mocha */
/*eslint-disable no-unused-expressions */ // Should.js

import 'should';
import {x as importedX} from '../..';

describe('Skeleton', function() {
	it('should import from this package\'s entry point', function() {
		importedX.should.equal('x');
	});
	it('should support ES6 in the unit tests too', function() {
		let foo = 'bar';
		foo.should.equal('bar');

		for (let x of ['ok']) {
			x.should.equal('ok');
		}
	});

	it('should copy non-js files to dist', function() {
		require('../config.json').x.should.equal('x');
	});
});
