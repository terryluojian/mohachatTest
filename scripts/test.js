// JavaScript Document

MessageQue = function () {
}

MessageQue.prototype = {
	
	counter : 0,
	queCounter : 0,
	threshold : 200,
	sleepLength : 10,
	procCount : 0,
	
	submitQue : function () {
		xajax_chat_process(xajax.getFormValues('que'));
	
		clearQue('timeQue[]');
		clearQue('messageQue[]');
		clearQue('toQue[]');
	},
	
	processQue : function () {
		if (((this.queCounter > 0) || (this.counter >= threshold)) && (this.procCount <= 0)) {
			this.counter = 0;		
			this.submitQue();
		} else {
			this.counter++;
		}
	
		setTimeout('processQue()', this.sleepLength);
	},
	
	clearQue : function (sId) {
		while (document.getElementById(sId)) {
			remove(sId);
			this.queCounter--;
		}
	},
	
	addMessageToQue : function (obj) {
		to = obj.title;
		
		form = document.getElementById(to);
		
		d = new Date();
		
		time = d.getTime();	
		message = form.message.value;
		
		create(document.que, "input", "timeQue[]", time, true);
		create(document.que, "input", "messageQue[]", escape(TEAencrypt(message, password)), true);		
		create(document.que, "input", "toQue[]", to, true);	
		
		this.queCounter++;
		
		addLocMesToBoard(time, message, to);
		
		form.reset();
			
		form.message.focus();
		
		messageArchiveObj.addToPrevMessages(message, to);
		
		return true;	
	}
}

queObj = new MessageQue();

processQue = queObj.processQue;