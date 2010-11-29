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

    $(iframe_doc).click(function(event){
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
    });
    //document.getElementById('commentEditor').contentWindow.document.style.cursor = "text";
});

function hideFormText() {
	var _inputs = document.getElementsByTagName('input');
	var _txt = document.getElementsByTagName('textarea');
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
