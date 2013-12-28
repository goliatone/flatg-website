/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'components/jquery/jquery',
        'foundation':'assets/js/foundation',
        'FlatG': 'FlatG'
    },
    shim:{
    	'foundation':{
            deps:['jquery']
        }
    }
});

define(['FlatG', 'jquery', 'foundation'], function (FlatG, $) {
    console.log('Loading');

    $(document).foundation();
    
	var FlatG = new FlatG();
	FlatG.init();
});