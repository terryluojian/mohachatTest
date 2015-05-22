// JavaScript Document
TextTween = function () {
}

TweenText.prototype = {	
	sysTimer : false,
	instance : 1,	
	objs : Array(),
	selfObj : this,	
		
	init : function (obj, prop, txt, original) {			
		this.objs[this.objs.length] = {'obj': obj, 'prop' : prop, 'txt': txt, 'original' : original};
	},
	
	play : function () {
		this.sysTimer = setInterval(this.animate, 800);		
	},
	
	stop : function (i) {		
		if (this.sysTimer) {
			clearInterval(this.sysTimer);
		}
		this.revert();
	},
	
	animate : function () {		
		selfObj.instance = 1-selfObj.instance;		
		switch (selfObj.instance) {
			default:
			case 0 : selfObj.revert(); break;
			case 1 : selfObj.change(); break;
		}		
	},
	
	change : function () {	
		for (i=0; i<this.objs.length; i++) {
			obj = this.objs[i];
			if (obj)
			obj['obj'][obj['prop']] = unescape(obj['txt']);
		}
	},
	
	revert : function () {		
		for (i=0; i<this.objs.length; i++) {
			obj = this.objs[i];
			if (obj)
			obj['obj'][obj['prop']] = unescape(obj['original']);
		}	
	}
}

ColorTween.prototype = new Tween();

TextTween.prototype = new Tween();

ttween = new TextTween();

ttween.init(document, 'title', 'MOHA', 'Hi Mohanjith');

obj = document.getElementById('mohan');

ctween = new ColorTween();

ctween.init(obj.style, 'backgroundColor', '#FF0000', '#0000FF');

ctween.play();