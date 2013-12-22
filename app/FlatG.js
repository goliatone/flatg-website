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

	var Template = function(){};

    Template.compile = function Template(template, otag, ctag) {
            var compiled = function(context){

                function replaceFn() {
                    var prop = arguments[1];
                    return (prop in context) ? context[prop] : '';
                }
                otag = otag || "{{";
                ctag = ctag || "}}";
                
                return template.replace(new RegExp(otag+"(\\w+)"+ctag,"g"), replaceFn);
            };
            return compiled;
    };


	var GithubRelease = function(config){
		$.extend(this, GithubRelease.settings, (config || {}));
	};

	GithubRelease.settings = {
		selector:'.github-release',
		endpoint:'tags',
		url:'https://api.github.com/repos/{{user}}/{{repo}}/{{endpoint}}',
		template:'<a href="{{zipball_url}}" class="button-flat radius download">Download FlatG {{name}}</a>'
	};

	GithubRelease.prototype.init = function(){
		this.urlBuilder = Template.compile(this.url);
		var options = {
			url: this.urlBuilder(this)
		};

		this.$view = $(this.selector);

		$.ajax(options)
		.done(this.onSuccess.bind(this))
		.fail(this.onError.bind(this));
	};

	GithubRelease.prototype.onSuccess = function(result){
		var template = Template.compile(this.template);
		var html = template(result[0]);
		console.log('SUCCESS: ', result, html);
		this.$view.html(html);
	};

	GithubRelease.prototype.onError = function(error){
		console.log('ERROR: ', error);
	};



	var github = new GithubRelease({user:'goliatone', repo:'flatg-core', endpoint:'tags'});
	github.init();



    var FlatG = function(config){
        console.log('FlatG: Constructor!');
    };

    FlatG.prototype.init = function(){
        console.log('FlatG: Init!!!');
        this.hideScrollbarIPhone();
    };

    FlatG.prototype.hideScrollbarIPhone = function(){
    	/mobi/i.test(navigator.userAgent) && !window.location.hash && setTimeout(function () {
		  window.scrollTo(0, 1);
		}, 500);
    };

    return FlatG;
});