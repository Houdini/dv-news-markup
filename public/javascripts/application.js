/**
 * Flash (http://jquery.lukelutman.com/plugins/flash)
 * A jQuery plugin for embedding Flash movies.
 * 
 * Version 1.0
 * November 9th, 2006
 *
 * Copyright (c) 2006 Luke Lutman (http://www.lukelutman.com)
 * Dual licensed under the MIT and GPL licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-license.php
 * 
 * Inspired by:
 * SWFObject (http://blog.deconcept.com/swfobject/)
 * UFO (http://www.bobbyvandersluis.com/ufo/)
 * sIFR (http://www.mikeindustries.com/sifr/)
 * 
 * IMPORTANT: 
 * The packed version of jQuery breaks ActiveX control
 * activation in Internet Explorer. Use JSMin to minifiy
 * jQuery (see: http://jquery.lukelutman.com/plugins/flash#activex).
 *
 **/ 
;(function(){
	
var $$;

/**
 * 
 * @desc Replace matching elements with a flash movie.
 * @author Luke Lutman
 * @version 1.0.1
 *
 * @name flash
 * @param Hash htmlOptions Options for the embed/object tag.
 * @param Hash pluginOptions Options for detecting/updating the Flash plugin (optional).
 * @param Function replace Custom block called for each matched element if flash is installed (optional).
 * @param Function update Custom block called for each matched if flash isn't installed (optional).
 * @type jQuery
 *
 * @cat plugins/flash
 * 
 * @example $('#hello').flash({ src: 'hello.swf' });
 * @desc Embed a Flash movie.
 *
 * @example $('#hello').flash({ src: 'hello.swf' }, { version: 8 });
 * @desc Embed a Flash 8 movie.
 *
 * @example $('#hello').flash({ src: 'hello.swf' }, { expressInstall: true });
 * @desc Embed a Flash movie using Express Install if flash isn't installed.
 *
 * @example $('#hello').flash({ src: 'hello.swf' }, { update: false });
 * @desc Embed a Flash movie, don't show an update message if Flash isn't installed.
 *
**/
$$ = jQuery.fn.flash = function(htmlOptions, pluginOptions, replace, update) {
	
	// Set the default block.
	var block = replace || $$.replace;
	
	// Merge the default and passed plugin options.
	pluginOptions = $$.copy($$.pluginOptions, pluginOptions);
	
	// Detect Flash.
	if(!$$.hasFlash(pluginOptions.version)) {
		// Use Express Install (if specified and Flash plugin 6,0,65 or higher is installed).
		if(pluginOptions.expressInstall && $$.hasFlash(6,0,65)) {
			// Add the necessary flashvars (merged later).
			var expressInstallOptions = {
				flashvars: {  	
					MMredirectURL: location,
					MMplayerType: 'PlugIn',
					MMdoctitle: jQuery('title').text() 
				}					
			};
		// Ask the user to update (if specified).
		} else if (pluginOptions.update) {
			// Change the block to insert the update message instead of the flash movie.
			block = update || $$.update;
		// Fail
		} else {
			// The required version of flash isn't installed.
			// Express Install is turned off, or flash 6,0,65 isn't installed.
			// Update is turned off.
			// Return without doing anything.
			return this;
		}
	}
	
	// Merge the default, express install and passed html options.
	htmlOptions = $$.copy($$.htmlOptions, expressInstallOptions, htmlOptions);
	
	// Invoke $block (with a copy of the merged html options) for each element.
	return this.each(function(){
		block.call(this, $$.copy(htmlOptions));
	});
	
};
/**
 *
 * @name flash.copy
 * @desc Copy an arbitrary number of objects into a new object.
 * @type Object
 * 
 * @example $$.copy({ foo: 1 }, { bar: 2 });
 * @result { foo: 1, bar: 2 };
 *
**/
$$.copy = function() {
	var options = {}, flashvars = {};
	for(var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		if(arg == undefined) continue;
		jQuery.extend(options, arg);
		// don't clobber one flash vars object with another
		// merge them instead
		if(arg.flashvars == undefined) continue;
		jQuery.extend(flashvars, arg.flashvars);
	}
	options.flashvars = flashvars;
	return options;
};
/*
 * @name flash.hasFlash
 * @desc Check if a specific version of the Flash plugin is installed
 * @type Boolean
 *
**/
$$.hasFlash = function() {
	// look for a flag in the query string to bypass flash detection
	if(/hasFlash\=true/.test(location)) return true;
	if(/hasFlash\=false/.test(location)) return false;
	var pv = $$.hasFlash.playerVersion().match(/\d+/g);
	var rv = String([arguments[0], arguments[1], arguments[2]]).match(/\d+/g) || String($$.pluginOptions.version).match(/\d+/g);
	for(var i = 0; i < 3; i++) {
		pv[i] = parseInt(pv[i] || 0);
		rv[i] = parseInt(rv[i] || 0);
		// player is less than required
		if(pv[i] < rv[i]) return false;
		// player is greater than required
		if(pv[i] > rv[i]) return true;
	}
	// major version, minor version and revision match exactly
	return true;
};
/**
 *
 * @name flash.hasFlash.playerVersion
 * @desc Get the version of the installed Flash plugin.
 * @type String
 *
**/
$$.hasFlash.playerVersion = function() {
	// ie
	try {
		try {
			// avoid fp6 minor version lookup issues
			// see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
			var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
			try { axo.AllowScriptAccess = 'always';	} 
			catch(e) { return '6,0,0'; }				
		} catch(e) {}
		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
	// other browsers
	} catch(e) {
		try {
			if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
				return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
			}
		} catch(e) {}		
	}
	return '0,0,0';
};
/**
 *
 * @name flash.htmlOptions
 * @desc The default set of options for the object or embed tag.
 *
**/
$$.htmlOptions = {
	height: 240,
	flashvars: {},
	pluginspage: 'http://www.adobe.com/go/getflashplayer',
	src: '#',
	type: 'application/x-shockwave-flash',
	width: 320		
};
/**
 *
 * @name flash.pluginOptions
 * @desc The default set of options for checking/updating the flash Plugin.
 *
**/
$$.pluginOptions = {
	expressInstall: false,
	update: true,
	version: '6.0.65'
};
/**
 *
 * @name flash.replace
 * @desc The default method for replacing an element with a Flash movie.
 *
**/
$$.replace = function(htmlOptions) {
	this.innerHTML = '<div class="alt">'+this.innerHTML+'</div>';
	jQuery(this)
		.addClass('flash-replaced')
		.prepend($$.transform(htmlOptions));
};
/**
 *
 * @name flash.update
 * @desc The default method for replacing an element with an update message.
 *
**/
$$.update = function(htmlOptions) {
	var url = String(location).split('?');
	url.splice(1,0,'?hasFlash=true&');
	url = url.join('');
	var msg = '<p>This content requires the Flash Player. <a href="http://www.adobe.com/go/getflashplayer">Download Flash Player</a>. Already have Flash Player? <a href="'+url+'">Click here.</a></p>';
	this.innerHTML = '<span class="alt">'+this.innerHTML+'</span>';
	jQuery(this)
		.addClass('flash-update')
		.prepend(msg);
};
/**
 *
 * @desc Convert a hash of html options to a string of attributes, using Function.apply(). 
 * @example toAttributeString.apply(htmlOptions)
 * @result foo="bar" foo="bar"
 *
**/
function toAttributeString() {
	var s = '';
	for(var key in this)
		if(typeof this[key] != 'function')
			s += key+'="'+this[key]+'" ';
	return s;		
};
/**
 *
 * @desc Convert a hash of flashvars to a url-encoded string, using Function.apply(). 
 * @example toFlashvarsString.apply(flashvarsObject)
 * @result foo=bar&foo=bar
 *
**/
function toFlashvarsString() {
	var s = '';
	for(var key in this)
		if(typeof this[key] != 'function')
			s += key+'='+encodeURIComponent(this[key])+'&';
	return s.replace(/&$/, '');		
};
/**
 *
 * @name flash.transform
 * @desc Transform a set of html options into an embed tag.
 * @type String 
 *
 * @example $$.transform(htmlOptions)
 * @result <embed src="foo.swf" ... />
 *
 * Note: The embed tag is NOT standards-compliant, but it 
 * works in all current browsers. flash.transform can be
 * overwritten with a custom function to generate more 
 * standards-compliant markup.
 *
**/
$$.transform = function(htmlOptions) {
	htmlOptions.toString = toAttributeString;
	if(htmlOptions.flashvars) htmlOptions.flashvars.toString = toFlashvarsString;
	return '<embed ' + String(htmlOptions) + '/>';		
};

/**
 *
 * Flash Player 9 Fix (http://blog.deconcept.com/2006/07/28/swfobject-143-released/)
 *
**/
if (window.attachEvent) {
	window.attachEvent("onbeforeunload", function(){
		__flash_unloadHandler = function() {};
		__flash_savedUnloadHandler = function() {};
	});
}
	
})();
/**
 * designMode jQuery plugin v0.1, by Emil Konow.
 * This plugin allows you to handle functionality related to designMode in a cross-browser way.
 */

/**
 * Cross-browser function to access a DOM:Document element
 * Example: $('#foo').contentDocument();
 *
 * @uses jQuery
 *
 * @return object DOM:Document - the document of the frame, iframe or window
 */
jQuery.fn.contentDocument = function() {
	var frame = this[0];
	if (frame.contentDocument) {
		return frame.contentDocument;
	} else if (frame.contentWindow && frame.contentWindow.document) {
		return frame.contentWindow.document;
	} else if (frame.document) {
		return frame.document;
	} else {
		return null;
	}
}

/**
 * Cross-browser function to set the designMode property
 * Example: $('#foo').designMode('on');
 *
 * @uses jQuery, jQuery.fn.contentDocument
 *
 * @param string mode - Which mode to use, should either 'on' or 'off'
 *
 * @return jQuery element - The jQuery element itself, to allow chaining
 */
jQuery.fn.designMode = function(mode) {
	// Default mode is 'on'
	var mode = mode || 'on';
	this.each(function() {
		var frame = $(this);
		var doc = frame.contentDocument();
		if (doc) {
			doc.designMode = mode;
			// Some browsers are kinda slow, so you'll have to wait for the window to load
			frame.load(function() {
				$(this).contentDocument().designMode = mode;
			});
		}
	});
	return this;
}

/**
 * Cross-browser function to execute designMode commands
 * Example: $('#foo').execCommand('formatblock', '<p>');
 *
 * @uses jQuery, jQuery.fn.contentDocument
 *
 * @param string cmd - The command to execute. Please see http://www.mozilla.org/editor/midas-spec.html
 * @param string param - Optional parameter, required by some commands
 *
 * @return jQuery element - The jQuery element itself, to allow chaining
 */
jQuery.fn.execCommand = function(cmd, param) {
	this.each(function() {
		var doc = $(this).contentDocument();
		if (doc) {
			// Use try-catch in case of invalid or unsupported commands
    		try {
				// Non-IE-browsers requires all three arguments
				doc.execCommand(cmd, false, param);
			} catch (e) {
			}
		}
	});
	return this;
}

$(function(){
    $('dl.top-news dt').click(function(){
        $(this).siblings().removeClass('active').end().next('dd').andSelf().addClass('active');
    });
    $('dl.top-news li').mouseover(function(){
        $(this).siblings().removeClass('active').end().addClass('active');
    });

    $('div.news-container dl dt').click(function(){
        $(this).siblings().removeClass('active').end().next('dd').andSelf().addClass('active');
    });


//    $('.textarea').add('form .textarea-bottom').add('#container').add('#commentEditor').click(function(event){
//        var $this = $(this).add('form .textarea-bottom').add('#container');
//        if (parseInt($this.css('height'), 10) < 20)
//        {
//            $this.animate({
//                height: '+=60'
//            }, 600, function(){
//
//            });
//        }
//    });
    $('#commentEditor').designMode();
    var iframe_doc = $('#commentEditor').contents().get(0);
    var open_comment_form = function()
    {
        var to_expand = $('form .textarea-bottom').add('#container').add('#commentEditor').add('.textarea');
        if (parseInt($('#commentEditor').css('height'), 10) < 20)
        {
            //console.log('expand')
            to_expand.animate({
                height: '+=140'
            }, 600, function(){
              $('.left-part').show('fast');
              $('.right-part').show('fast');
            });
        }
    }
    $('a.comment').click(
        function(event)
        {
          event.preventDefault();
          open_comment_form();
        }
    );

    $(iframe_doc).click(function(event){
        open_comment_form();
    });
    //document.getElementById('commentEditor').contentWindow.document.style.cursor = "text";

    var comments = $('#comments');
    if (comments.length !== 0)
    {
      var hidden_comments = comments.children(),
          first_three = comments.find(':nth-child(1), :nth-child(2), :nth-child(3)'),
          comments_bottom = $('.last-comments .comments-bottom');
      hidden_comments.hide();
      first_three.show();
      if (hidden_comments.size() > 3)
      {
        var show_all_comments = $('<a id="show_all_comments">Посмотреть все комментарии (' + hidden_comments.size() + ')</a>');
        show_all_comments.click(function(event){
            hidden_comments.show();
            show_all_comments.hide();
            comments_bottom.css('padding-bottom', '10px');
        });
        comments_bottom.css('padding-bottom', '40px');
        comments.append(show_all_comments);
      }
      comments.show();
    }

    var story_container = $('.story-container');
    if (false && story_container.length !== 0)
    {
      var elements = $('.elements');
      if(elements.find('.element').length > 3){
        var children = elements.find('.element'),
            $this = $(this),
            first_three = elements.find(':nth-child(1), :nth-child(2), :nth-child(3)');
        children.hide();
        first_three.show();
        var show_all_elements = $this.prev().find('.show_all_elements'),
            link = show_all_elements.find('a');
        link.html('Посмотреть все');
        link.click(function(event){
          children.show();
          show_all_elements.hide();
        });
      }
    }

    $('.story .element h2 a').click(function(event){
        event.preventDefault();
        story_open_full_text(this);
    });

    var photo_gallery = $('.images');
    if (photo_gallery.length !== 0)
    {
      Galleria.loadTheme('/js/galleria/galleria.classic.js');
      photo_gallery.galleria();
    }

    var timeline = $('#timeline');
    if (timeline.length !== 0)
    {
      timeline.flash({src:'/timeline.swf', width:"100%", height:"131", quality: "high", align:"middle", play: "true", loop: "true", scale: "showall", wmode: "window", device: "false", bgcolor: "#EFF6FC", name: "timeline", menu: true, allowfullscreen: "false", allowscriptaccess: "sameDomain"});
    }

});

var story_open_full_text = function(this_a)
{
        var $this = $(this_a),
            element = $this.parent().parent(),
            body = element.find('.body');
        if(body.length === 0)
        {
          var path = $this.attr('href').split('/');
          $.get('/ajax/body/' + path[path.length - 1], 
            function(data)
            {
              element.append('<div class="body">'+data+'</div>');
            }
            );
        } else {
          if (body.is(':hidden')) {
            body.show();
          } else {
            body.hide();
          }
        }
}

function onItemClicked(id) {
  var this_a = $('#' + id);
  var element = this_a.parent().parent();
  var body = element.find('.body');

  if (body.length === 0) {
    console.log('length === 0');
    story_open_full_text(this_a);
  } else {
    console.log('body length more then zero');
    if (body.is(':hidden'))
      story_open_full_text(this_a);
  }
  $('html, body').animate({scrollTop:this_a.offset().top}, {duration: 'slow', easing: 'swing'});
}

function onFlashletReady() {
 sendDataToFlashlet()
}

function thisMovie(movieName) {
 if (navigator.appName.indexOf("Microsoft") != -1) {
	 return window[movieName];
 } else {
	 return document[movieName];
 }
}

function sendDataToFlashlet() {
    var data = '[',
        elements = $('.element'),
        elements_of_obj = [];
    for (var i = 0; i < elements.length; i += 1)
        elements_of_obj.push({title: $.trim($(elements[i]).find('h2 a').html()), created_at: $.trim($(elements[i]).find('.system_time').html()), id: $(elements[i]).find('h2 a').attr('id')});
    elements_of_obj.sort(function(a, b){
        if (a.created_at < b.created_at) {
            return -1
        } else if (a.created_at > b.created_at) {
            return 1;
        } else {
            return 0;
        }
    });
    console.log()
    for (var i = 0; i < elements_of_obj.length; i += 1) {
        data += "{\"title\": \"" + elements_of_obj[i].title +  "\",\"created_at\":\"" + elements_of_obj[i].created_at + "\",\"id\":\"" + elements_of_obj[i].id + "\"}";
        if (i !== elements_of_obj.length - 1)
            data += ',';
    }
//    for(var i = 0; i < elements.length; i += 1)
//    {
//        var news_hash = "{\"title\": \"" + $.trim($(elements[i]).find('h2 a').html()) +  "\",\"created_at\":\"" + $.trim($(elements[i]).find('.system_time').html()) + "\",\"id\":\"" + $(elements[i]).find('h2 a').attr('id') + "\"}";
//        data += news_hash;
//        if (i !== elements.length - 1)
//        data += ',';
//    }
    data += ']';
    thisMovie("timeline").updateData(data);
}

function hideFormText() {
	var _inputs = document.getElementsByTagName('input');
	var _txt = [];//document.getElementsByTagName('textarea');
	var _value = [];

	if (_inputs) {
		for(var i=0; i<_inputs.length; i++) {
			if (_inputs[i].type == 'text' || _inputs[i].type == 'password') {

				_inputs[i].index = i;
				_value[i] = _inputs[i].value;

				_inputs[i].onfocus = function(){
					if (this.value == _value[this.index])
						this.value = '';
				}
				_inputs[i].onblur = function(){
					if (this.value == '')
						this.value = _value[this.index];
				}
			}
		}
	}
	if (_txt) {
		for(var i=0; i<_txt.length; i++) {
			_txt[i].index = i;
			_value['txt'+i] = _txt[i].value;

			_txt[i].onfocus = function(){
				if (this.value == _value['txt'+this.index] && this.value.indexOf('@') == -1)
					this.value = '';
			}
			_txt[i].onblur = function(){
				if (this.value == '')
					this.value = _value['txt'+this.index];
			}
		}
	}
}
if (window.addEventListener)
	window.addEventListener("load", hideFormText, false);
else if (window.attachEvent)
	window.attachEvent("onload", hideFormText);
