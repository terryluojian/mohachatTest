// JavaScript Document

// Error handling

window.onerror = err;

function err(message, URI, line) {			
	
	popPanel($('logPanel'));	
	
	errTxt = "<b>"+URI;
	
	if ('number' == typeof line) errTxt +=" Line";
	
	errTxt += " "+line+"</b><br />";
	errTxt += unescape(message)+"<br /><br />";	
	
	$("log").innerHTML = errTxt+$("log").innerHTML;	
	
return true;
}

function transErr(message, URI, line) {			
	
	popPanel($('transLogPanel'));	
	
	errTxt = "<b>"+URI;
	
	if ('number' == typeof line) errTxt +=" Line";
	
	errTxt += " "+line+"</b><br />";
	errTxt += unescape(message)+"<br /><br />";	
	
	$("transLog").innerHTML = errTxt+$("log").innerHTML;	
	
return true;
}

updateProgress('scripts/error.js');