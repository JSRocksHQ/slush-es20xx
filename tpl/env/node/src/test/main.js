// jshint mocha: true

import {x as importedX} from '../..';

require('should');

describe('Skeleton', function() {
    it('should import from this package\'s entry point', function() {
        importedX.should.equal('x');
    });
    it('should support ES6 in the unit tests too', function() {
        let foo = 'bar';
        foo.should.equal('bar');
    });

    it('should copy non-js files to dist', function() {
        require('../config.json').x.should.equal('x');
    });
});
