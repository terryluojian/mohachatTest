// JavaScript Document
$('chatHoursPanel').style.display = 'none';
	
function loginProc() {
	//new Effect.BlindUp('logInBox');
	$('logInBox').style.display = 'none';
	$('progressx').style.display = 'block';
	xajax_authenticate(xajax.getFormValues('login'));
}

function failed(code) {	
	$('progressx').style.display = 'none';
	$('logInBox').style.display = 'block';
	$('register').value = 0;
}

function registerX() {
	$('register').value = 1;
	loginProc();
}

function winLoaded() {	
	new Effect.BlindDown('chatHoursPanel');
	new Draggable('logInBox', {handle: 'logInBox', ghosting: true});
	new Draggable('chatHoursPanel', {handle: 'chatHoursPanel', ghosting: true});
}

window.onload = winLoaded;
