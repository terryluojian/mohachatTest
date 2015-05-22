// JavaScript Document
Effectx = function () {
}

Effectx.prototype = {
	init : function () {
	},
	
	BlindUp : function(element) {
	  //element = $(element);
	  //element.makeClipping();
	  /*return new Effect.Scale(element, 0,
		Object.extend({ scaleContent: false, 
		  scaleX: false, 
		  restoreAfterFinish: true,
		  afterFinishInternal: function(effect) {
			effect.element.hide();
			effect.element.undoClipping();
		  } 
		}, arguments[1] || {})
	  );*/
	  //alert(element);
	  return new YAHOO.util.Anim(element, { opacity: { to: 0 } }, 1, YAHOO.util.Easing.easeOut);
	}
}

updateProgress("scripts/animate.js");