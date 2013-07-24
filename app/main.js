/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'components/jquery/jquery',
        'FlatG': 'FlatG'
    }
});

define(['FlatG', 'jquery'], function (FlatG, $) {
    console.log('Loading');

	var FlatG = new FlatG();
	FlatG.init();
});