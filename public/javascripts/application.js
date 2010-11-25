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
    $('form.jqtransform').jqTransform();
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
