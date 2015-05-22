function TextTween(obj, property, txt, origional, interval) {
	
	var sysTimer = false;
	instance = 1;	
		
	this.play = function () {
		sysTimer = setTimeout('animate();', interval*1000);		
	};
	
	this.stop = function () {		
		if (sysTimer) {
			clearTimeout(sysTimer);
		}
		revert();
	};
	
	animate = function () {			
		instance = 1-instance;		
		switch (instance) {
			default:
			case 0 : revert(); break;
			case 1 : change(); break;
		}
		sysTimer = setTimeout('animate();', interval*1000);				
	};
	
	change = function () {		
		obj[property] = unescape(txt);
	};
	
	revert = function () {		
		obj[property] = unescape(origional);		
	};
}

function ColorTween(obj, property, changeCol, origional, interval) {
	
	var sysTimer = false;
	instance = 1;	
		
	this.play = function () {
		sysTimer = setTimeout('animateCol();', interval*1000);		
	};
	
	this.stop = function () {		
		if (sysTimer) {
			clearTimeout(sysTimer);
		}
		revert();
	};
	
	animateCol = function () {			
		instance = 1-instance;		
		switch (instance) {
			default:
			case 0 : revert(); break;
			case 1 : change(); break;
		}
		sysTimer = setTimeout('animateCol();', interval*1000);				
	};
	
	change = function () {		
		obj[property] = '#'+changeCol;
	};
	
	revert = function () {		
		obj[property] = '#'+origional;		
	};
}