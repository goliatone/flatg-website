/*
 * FlatG
 * https://github.com/goliatone/flatg-website
 *
 * Copyright (c) 2013 goliatone
 * Licensed under the MIT license.
 */
/*global define:true*/
/* jshint strict: false */
define('FlatG', ['jquery'], function($) {

    var FlatG = function(config){
        console.log('FlatG: Constructor!');
    };

    FlatG.prototype.init = function(){
        console.log('FlatG: Init!');
        return 'This is just a stub!';
    };

    return FlatG;
});