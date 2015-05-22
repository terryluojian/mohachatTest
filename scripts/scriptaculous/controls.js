if(typeof Effect=="undefined"){throw ("controls.js requires including script.aculo.us' effects.js library");}var Autocompleter={};Autocompleter.Base=function(){};Autocompleter.Base.prototype={baseInitialize:function(_1,_2,_3){this.element=$(_1);this.update=$(_2);this.hasFocus=false;this.changed=false;this.active=false;this.index=0;this.entryCount=0;if(this.setOptions){this.setOptions(_3);}else{this.options=_3||{};}this.options.paramName=this.options.paramName||this.element.name;this.options.tokens=this.options.tokens||[];this.options.frequency=this.options.frequency||0.4;this.options.minChars=this.options.minChars||1;this.options.onShow=this.options.onShow||function(_4,_5){if(!_5.style.position||_5.style.position=="absolute"){_5.style.position="absolute";Position.clone(_4,_5,{setHeight:false,offsetTop:_4.offsetHeight});}Effect.Appear(_5,{duration:0.15});};this.options.onHide=this.options.onHide||function(_6,_7){new Effect.Fade(_7,{duration:0.15});};if(typeof (this.options.tokens)=="string"){this.options.tokens=new Array(this.options.tokens);}this.observer=null;this.element.setAttribute("autocomplete","off");Element.hide(this.update);Event.observe(this.element,"blur",this.onBlur.bindAsEventListener(this));Event.observe(this.element,"keypress",this.onKeyPress.bindAsEventListener(this));},show:function(){if(Element.getStyle(this.update,"display")=="none"){this.options.onShow(this.element,this.update);}if(!this.iefix&&(navigator.appVersion.indexOf("MSIE")>0)&&(navigator.userAgent.indexOf("Opera")<0)&&(Element.getStyle(this.update,"position")=="absolute")){new Insertion.After(this.update,"<iframe id=\""+this.update.id+"_iefix\" "+"style=\"display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);\" "+"src=\"javascript:false;\" frameborder=\"0\" scrolling=\"no\"></iframe>");this.iefix=$(this.update.id+"_iefix");}if(this.iefix){setTimeout(this.fixIEOverlapping.bind(this),50);}},fixIEOverlapping:function(){Position.clone(this.update,this.iefix,{setTop:(!this.update.style.height)});this.iefix.style.zIndex=1;this.update.style.zIndex=2;Element.show(this.iefix);},hide:function(){this.stopIndicator();if(Element.getStyle(this.update,"display")!="none"){this.options.onHide(this.element,this.update);}if(this.iefix){Element.hide(this.iefix);}},startIndicator:function(){if(this.options.indicator){Element.show(this.options.indicator);}},stopIndicator:function(){if(this.options.indicator){Element.hide(this.options.indicator);}},onKeyPress:function(_8){if(this.active){switch(_8.keyCode){case Event.KEY_TAB:case Event.KEY_RETURN:this.selectEntry();Event.stop(_8);case Event.KEY_ESC:this.hide();this.active=false;Event.stop(_8);return;case Event.KEY_LEFT:case Event.KEY_RIGHT:return;case Event.KEY_UP:this.markPrevious();this.render();if(navigator.appVersion.indexOf("AppleWebKit")>0){Event.stop(_8);}return;case Event.KEY_DOWN:this.markNext();this.render();if(navigator.appVersion.indexOf("AppleWebKit")>0){Event.stop(_8);}return;}}else{if(_8.keyCode==Event.KEY_TAB||_8.keyCode==Event.KEY_RETURN||(navigator.appVersion.indexOf("AppleWebKit")>0&&_8.keyCode==0)){return;}}this.changed=true;this.hasFocus=true;if(this.observer){clearTimeout(this.observer);}this.observer=setTimeout(this.onObserverEvent.bind(this),this.options.frequency*1000);},activate:function(){this.changed=false;this.hasFocus=true;this.getUpdatedChoices();},onHover:function(_9){var _a=Event.findElement(_9,"LI");if(this.index!=_a.autocompleteIndex){this.index=_a.autocompleteIndex;this.render();}Event.stop(_9);},onClick:function(_b){var _c=Event.findElement(_b,"LI");this.index=_c.autocompleteIndex;this.selectEntry();this.hide();},onBlur:function(_d){setTimeout(this.hide.bind(this),250);this.hasFocus=false;this.active=false;},render:function(){if(this.entryCount>0){for(var i=0;i<this.entryCount;i++){this.index==i?Element.addClassName(this.getEntry(i),"selected"):Element.removeClassName(this.getEntry(i),"selected");}if(this.hasFocus){this.show();this.active=true;}}else{this.active=false;this.hide();}},markPrevious:function(){if(this.index>0){this.index--;}else{this.index=this.entryCount-1;}this.getEntry(this.index).scrollIntoView(true);},markNext:function(){if(this.index<this.entryCount-1){this.index++;}else{this.index=0;}this.getEntry(this.index).scrollIntoView(false);},getEntry:function(_f){return this.update.firstChild.childNodes[_f];},getCurrentEntry:function(){return this.getEntry(this.index);},selectEntry:function(){this.active=false;this.updateElement(this.getCurrentEntry());},updateElement:function(_10){if(this.options.updateElement){this.options.updateElement(_10);return;}var _11="";if(this.options.select){var _12=document.getElementsByClassName(this.options.select,_10)||[];if(_12.length>0){_11=Element.collectTextNodes(_12[0],this.options.select);}}else{_11=Element.collectTextNodesIgnoreClass(_10,"informal");}var _13=this.findLastToken();if(_13!=-1){var _14=this.element.value.substr(0,_13+1);var _15=this.element.value.substr(_13+1).match(/^\s+/);if(_15){_14+=_15[0];}this.element.value=_14+_11;}else{this.element.value=_11;}this.element.focus();if(this.options.afterUpdateElement){this.options.afterUpdateElement(this.element,_10);}},updateChoices:function(_16){if(!this.changed&&this.hasFocus){this.update.innerHTML=_16;Element.cleanWhitespace(this.update);Element.cleanWhitespace(this.update.firstChild);if(this.update.firstChild&&this.update.firstChild.childNodes){this.entryCount=this.update.firstChild.childNodes.length;for(var i=0;i<this.entryCount;i++){var _18=this.getEntry(i);_18.autocompleteIndex=i;this.addObservers(_18);}}else{this.entryCount=0;}this.stopIndicator();this.index=0;if(this.entryCount==1&&this.options.autoSelect){this.selectEntry();this.hide();}else{this.render();}}},addObservers:function(_19){Event.observe(_19,"mouseover",this.onHover.bindAsEventListener(this));Event.observe(_19,"click",this.onClick.bindAsEventListener(this));},onObserverEvent:function(){this.changed=false;if(this.getToken().length>=this.options.minChars){this.startIndicator();this.getUpdatedChoices();}else{this.active=false;this.hide();}},getToken:function(){var _1a=this.findLastToken();if(_1a!=-1){var ret=this.element.value.substr(_1a+1).replace(/^\s+/,"").replace(/\s+$/,"");}else{var ret=this.element.value;}return /\n/.test(ret)?"":ret;},findLastToken:function(){var _1c=-1;for(var i=0;i<this.options.tokens.length;i++){var _1e=this.element.value.lastIndexOf(this.options.tokens[i]);if(_1e>_1c){_1c=_1e;}}return _1c;}};Ajax.Autocompleter=Class.create();Object.extend(Object.extend(Ajax.Autocompleter.prototype,Autocompleter.Base.prototype),{initialize:function(_1f,_20,url,_22){this.baseInitialize(_1f,_20,_22);this.options.asynchronous=true;this.options.onComplete=this.onComplete.bind(this);this.options.defaultParams=this.options.parameters||null;this.url=url;},getUpdatedChoices:function(){entry=encodeURIComponent(this.options.paramName)+"="+encodeURIComponent(this.getToken());this.options.parameters=this.options.callback?this.options.callback(this.element,entry):entry;if(this.options.defaultParams){this.options.parameters+="&"+this.options.defaultParams;}new Ajax.Request(this.url,this.options);},onComplete:function(_23){this.updateChoices(_23.responseText);}});Autocompleter.Local=Class.create();Autocompleter.Local.prototype=Object.extend(new Autocompleter.Base(),{initialize:function(_24,_25,_26,_27){this.baseInitialize(_24,_25,_27);this.options.array=_26;},getUpdatedChoices:function(){this.updateChoices(this.options.selector(this));},setOptions:function(_28){this.options=Object.extend({choices:10,partialSearch:true,partialChars:2,ignoreCase:true,fullSearch:false,selector:function(_29){var ret=[];var _2b=[];var _2c=_29.getToken();var _2d=0;for(var i=0;i<_29.options.array.length&&ret.length<_29.options.choices;i++){var _2f=_29.options.array[i];var _30=_29.options.ignoreCase?_2f.toLowerCase().indexOf(_2c.toLowerCase()):_2f.indexOf(_2c);while(_30!=-1){if(_30==0&&_2f.length!=_2c.length){ret.push("<li><strong>"+_2f.substr(0,_2c.length)+"</strong>"+_2f.substr(_2c.length)+"</li>");break;}else{if(_2c.length>=_29.options.partialChars&&_29.options.partialSearch&&_30!=-1){if(_29.options.fullSearch||/\s/.test(_2f.substr(_30-1,1))){_2b.push("<li>"+_2f.substr(0,_30)+"<strong>"+_2f.substr(_30,_2c.length)+"</strong>"+_2f.substr(_30+_2c.length)+"</li>");break;}}}_30=_29.options.ignoreCase?_2f.toLowerCase().indexOf(_2c.toLowerCase(),_30+1):_2f.indexOf(_2c,_30+1);}}if(_2b.length){ret=ret.concat(_2b.slice(0,_29.options.choices-ret.length));}return "<ul>"+ret.join("")+"</ul>";}},_28||{});}});Field.scrollFreeActivate=function(_31){setTimeout(function(){Field.activate(_31);},1);};Ajax.InPlaceEditor=Class.create();Ajax.InPlaceEditor.defaultHighlightColor="#FFFF99";Ajax.InPlaceEditor.prototype={initialize:function(_32,url,_34){this.url=url;this.element=$(_32);this.options=Object.extend({okButton:true,okText:"ok",cancelLink:true,cancelText:"cancel",savingText:"Saving...",clickToEditText:"Click to edit",okText:"ok",rows:1,onComplete:function(_35,_36){new Effect.Highlight(_36,{startcolor:this.options.highlightcolor});},onFailure:function(_37){alert("Error communicating with the server: "+_37.responseText.stripTags());},callback:function(_38){return Form.serialize(_38);},handleLineBreaks:true,loadingText:"Loading...",savingClassName:"inplaceeditor-saving",loadingClassName:"inplaceeditor-loading",formClassName:"inplaceeditor-form",highlightcolor:Ajax.InPlaceEditor.defaultHighlightColor,highlightendcolor:"#FFFFFF",externalControl:null,submitOnBlur:false,ajaxOptions:{},evalScripts:false},_34||{});if(!this.options.formId&&this.element.id){this.options.formId=this.element.id+"-inplaceeditor";if($(this.options.formId)){this.options.formId=null;}}if(this.options.externalControl){this.options.externalControl=$(this.options.externalControl);}this.originalBackground=Element.getStyle(this.element,"background-color");if(!this.originalBackground){this.originalBackground="transparent";}this.element.title=this.options.clickToEditText;this.onclickListener=this.enterEditMode.bindAsEventListener(this);this.mouseoverListener=this.enterHover.bindAsEventListener(this);this.mouseoutListener=this.leaveHover.bindAsEventListener(this);Event.observe(this.element,"click",this.onclickListener);Event.observe(this.element,"mouseover",this.mouseoverListener);Event.observe(this.element,"mouseout",this.mouseoutListener);if(this.options.externalControl){Event.observe(this.options.externalControl,"click",this.onclickListener);Event.observe(this.options.externalControl,"mouseover",this.mouseoverListener);Event.observe(this.options.externalControl,"mouseout",this.mouseoutListener);}},enterEditMode:function(evt){if(this.saving){return;}if(this.editing){return;}this.editing=true;this.onEnterEditMode();if(this.options.externalControl){Element.hide(this.options.externalControl);}Element.hide(this.element);this.createForm();this.element.parentNode.insertBefore(this.form,this.element);if(!this.options.loadTextURL){Field.scrollFreeActivate(this.editField);}if(evt){Event.stop(evt);}return false;},createForm:function(){this.form=document.createElement("form");this.form.id=this.options.formId;Element.addClassName(this.form,this.options.formClassName);this.form.onsubmit=this.onSubmit.bind(this);this.createEditField();if(this.options.textarea){var br=document.createElement("br");this.form.appendChild(br);}if(this.options.okButton){okButton=document.createElement("input");okButton.type="submit";okButton.value=this.options.okText;okButton.className="editor_ok_button";this.form.appendChild(okButton);}if(this.options.cancelLink){cancelLink=document.createElement("a");cancelLink.href="#";cancelLink.appendChild(document.createTextNode(this.options.cancelText));cancelLink.onclick=this.onclickCancel.bind(this);cancelLink.className="editor_cancel";this.form.appendChild(cancelLink);}},hasHTMLLineBreaks:function(_3b){if(!this.options.handleLineBreaks){return false;}return _3b.match(/<br/i)||_3b.match(/<p>/i);},convertHTMLLineBreaks:function(_3c){return _3c.replace(/<br>/gi,"\n").replace(/<br\/>/gi,"\n").replace(/<\/p>/gi,"\n").replace(/<p>/gi,"");},createEditField:function(){var _3d;if(this.options.loadTextURL){_3d=this.options.loadingText;}else{_3d=this.getText();}var obj=this;if(this.options.rows==1&&!this.hasHTMLLineBreaks(_3d)){this.options.textarea=false;var _3f=document.createElement("input");_3f.obj=this;_3f.type="text";_3f.name="value";_3f.value=_3d;_3f.style.backgroundColor=this.options.highlightcolor;_3f.className="editor_field";var _40=this.options.size||this.options.cols||0;if(_40!=0){_3f.size=_40;}if(this.options.submitOnBlur){_3f.onblur=this.onSubmit.bind(this);}this.editField=_3f;}else{this.options.textarea=true;var _41=document.createElement("textarea");_41.obj=this;_41.name="value";_41.value=this.convertHTMLLineBreaks(_3d);_41.rows=this.options.rows;_41.cols=this.options.cols||40;_41.className="editor_field";if(this.options.submitOnBlur){_41.onblur=this.onSubmit.bind(this);}this.editField=_41;}if(this.options.loadTextURL){this.loadExternalText();}this.form.appendChild(this.editField);},getText:function(){return this.element.innerHTML;},loadExternalText:function(){Element.addClassName(this.form,this.options.loadingClassName);this.editField.disabled=true;new Ajax.Request(this.options.loadTextURL,Object.extend({asynchronous:true,onComplete:this.onLoadedExternalText.bind(this)},this.options.ajaxOptions));},onLoadedExternalText:function(_42){Element.removeClassName(this.form,this.options.loadingClassName);this.editField.disabled=false;this.editField.value=_42.responseText.stripTags();Field.scrollFreeActivate(this.editField);},onclickCancel:function(){this.onComplete();this.leaveEditMode();return false;},onFailure:function(_43){this.options.onFailure(_43);if(this.oldInnerHTML){this.element.innerHTML=this.oldInnerHTML;this.oldInnerHTML=null;}return false;},onSubmit:function(){var _44=this.form;var _45=this.editField.value;this.onLoading();if(this.options.evalScripts){new Ajax.Request(this.url,Object.extend({parameters:this.options.callback(_44,_45),onComplete:this.onComplete.bind(this),onFailure:this.onFailure.bind(this),asynchronous:true,evalScripts:true},this.options.ajaxOptions));}else{new Ajax.Updater({success:this.element,failure:null},this.url,Object.extend({parameters:this.options.callback(_44,_45),onComplete:this.onComplete.bind(this),onFailure:this.onFailure.bind(this)},this.options.ajaxOptions));}if(arguments.length>1){Event.stop(arguments[0]);}return false;},onLoading:function(){this.saving=true;this.removeForm();this.leaveHover();this.showSaving();},showSaving:function(){this.oldInnerHTML=this.element.innerHTML;this.element.innerHTML=this.options.savingText;Element.addClassName(this.element,this.options.savingClassName);this.element.style.backgroundColor=this.originalBackground;Element.show(this.element);},removeForm:function(){if(this.form){if(this.form.parentNode){Element.remove(this.form);}this.form=null;}},enterHover:function(){if(this.saving){return;}this.element.style.backgroundColor=this.options.highlightcolor;if(this.effect){this.effect.cancel();}Element.addClassName(this.element,this.options.hoverClassName);},leaveHover:function(){if(this.options.backgroundColor){this.element.style.backgroundColor=this.oldBackground;}Element.removeClassName(this.element,this.options.hoverClassName);if(this.saving){return;}this.effect=new Effect.Highlight(this.element,{startcolor:this.options.highlightcolor,endcolor:this.options.highlightendcolor,restorecolor:this.originalBackground});},leaveEditMode:function(){Element.removeClassName(this.element,this.options.savingClassName);this.removeForm();this.leaveHover();this.element.style.backgroundColor=this.originalBackground;Element.show(this.element);if(this.options.externalControl){Element.show(this.options.externalControl);}this.editing=false;this.saving=false;this.oldInnerHTML=null;this.onLeaveEditMode();},onComplete:function(_46){this.leaveEditMode();this.options.onComplete.bind(this)(_46,this.element);},onEnterEditMode:function(){},onLeaveEditMode:function(){},dispose:function(){if(this.oldInnerHTML){this.element.innerHTML=this.oldInnerHTML;}this.leaveEditMode();Event.stopObserving(this.element,"click",this.onclickListener);Event.stopObserving(this.element,"mouseover",this.mouseoverListener);Event.stopObserving(this.element,"mouseout",this.mouseoutListener);if(this.options.externalControl){Event.stopObserving(this.options.externalControl,"click",this.onclickListener);Event.stopObserving(this.options.externalControl,"mouseover",this.mouseoverListener);Event.stopObserving(this.options.externalControl,"mouseout",this.mouseoutListener);}}};Ajax.InPlaceCollectionEditor=Class.create();Object.extend(Ajax.InPlaceCollectionEditor.prototype,Ajax.InPlaceEditor.prototype);Object.extend(Ajax.InPlaceCollectionEditor.prototype,{createEditField:function(){if(!this.cached_selectTag){var _47=document.createElement("select");var _48=this.options.collection||[];var _49;_48.each(function(e,i){_49=document.createElement("option");_49.value=(e instanceof Array)?e[0]:e;if((typeof this.options.value=="undefined")&&((e instanceof Array)?this.element.innerHTML==e[1]:e==_49.value)){_49.selected=true;}if(this.options.value==_49.value){_49.selected=true;}_49.appendChild(document.createTextNode((e instanceof Array)?e[1]:e));_47.appendChild(_49);}.bind(this));this.cached_selectTag=_47;}this.editField=this.cached_selectTag;if(this.options.loadTextURL){this.loadExternalText();}this.form.appendChild(this.editField);this.options.callback=function(_4c,_4d){return "value="+encodeURIComponent(_4d);};}});Form.Element.DelayedObserver=Class.create();Form.Element.DelayedObserver.prototype={initialize:function(_4e,_4f,_50){this.delay=_4f||0.5;this.element=$(_4e);this.callback=_50;this.timer=null;this.lastValue=$F(this.element);Event.observe(this.element,"keyup",this.delayedListener.bindAsEventListener(this));},delayedListener:function(_51){if(this.lastValue==$F(this.element)){return;}if(this.timer){clearTimeout(this.timer);}this.timer=setTimeout(this.onTimerEvent.bind(this),this.delay*1000);this.lastValue=$F(this.element);},onTimerEvent:function(){this.timer=null;this.callback(this.element,$F(this.element));}};