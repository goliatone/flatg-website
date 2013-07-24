/*global define:true*/
/*global describe:true */
/*global it:true */
/*global expect:true */
/*global beforeEach:true */
/* jshint strict: false */
define(['FlatG', 'jquery'], function(FlatG, $) {

    describe('just checking', function() {

        it('FlatG shold be loaded', function() {
            expect(FlatG).toBeTruthy();
            var FlatG = new FlatG();
            expect(FlatG).toBeTruthy();
        });

        it('FlatG shold initialize', function() {
            var FlatG = new FlatG();
            var output   = FlatG.init();
            var expected = 'This is just a stub!';
            expect(output).toEqual(expected);
        });
        
    });

});