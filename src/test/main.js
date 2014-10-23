var myPackage = require('../..');
require('should');

describe('Skeleton', function() {
	it('should support ES6 in the unit tests too', function() {
		let foo = 'bar';
		foo.should.equal('bar');
	});

	it('should copy non-js files to dist', function() {
		require('../config.json').x.should.equal('x');
	});
});
