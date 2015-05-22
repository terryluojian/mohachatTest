if(!Control){var Control={};}Control.Slider=Class.create();Control.Slider.prototype={initialize:function(_1,_2,_3){var _4=this;if(_1 instanceof Array){this.handles=_1.collect(function(e){return $(e);});}else{this.handles=[$(_1)];}this.track=$(_2);this.options=_3||{};this.axis=this.options.axis||"horizontal";this.increment=this.options.increment||1;this.step=parseInt(this.options.step||"1");this.range=this.options.range||$R(0,1);this.value=0;this.values=this.handles.map(function(){return 0;});this.spans=this.options.spans?this.options.spans.map(function(s){return $(s);}):false;this.options.startSpan=$(this.options.startSpan||null);this.options.endSpan=$(this.options.endSpan||null);this.restricted=this.options.restricted||false;this.maximum=this.options.maximum||this.range.end;this.minimum=this.options.minimum||this.range.start;this.alignX=parseInt(this.options.alignX||"0");this.alignY=parseInt(this.options.alignY||"0");this.trackLength=this.maximumOffset()-this.minimumOffset();this.handleLength=this.isVertical()?(this.handles[0].offsetHeight!=0?this.handles[0].offsetHeight:this.handles[0].style.height.replace(/px$/,"")):(this.handles[0].offsetWidth!=0?this.handles[0].offsetWidth:this.handles[0].style.width.replace(/px$/,""));this.active=false;this.dragging=false;this.disabled=false;if(this.options.disabled){this.setDisabled();}this.allowedValues=this.options.values?this.options.values.sortBy(Prototype.K):false;if(this.allowedValues){this.minimum=this.allowedValues.min();this.maximum=this.allowedValues.max();}this.eventMouseDown=this.startDrag.bindAsEventListener(this);this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.update.bindAsEventListener(this);this.handles.each(function(h,i){i=_4.handles.length-1-i;_4.setValue(parseFloat((_4.options.sliderValue instanceof Array?_4.options.sliderValue[i]:_4.options.sliderValue)||_4.range.start),i);Element.makePositioned(h);Event.observe(h,"mousedown",_4.eventMouseDown);});Event.observe(this.track,"mousedown",this.eventMouseDown);Event.observe(document,"mouseup",this.eventMouseUp);Event.observe(document,"mousemove",this.eventMouseMove);this.initialized=true;},dispose:function(){var _9=this;Event.stopObserving(this.track,"mousedown",this.eventMouseDown);Event.stopObserving(document,"mouseup",this.eventMouseUp);Event.stopObserving(document,"mousemove",this.eventMouseMove);this.handles.each(function(h){Event.stopObserving(h,"mousedown",_9.eventMouseDown);});},setDisabled:function(){this.disabled=true;},setEnabled:function(){this.disabled=false;},getNearestValue:function(_b){if(this.allowedValues){if(_b>=this.allowedValues.max()){return (this.allowedValues.max());}if(_b<=this.allowedValues.min()){return (this.allowedValues.min());}var _c=Math.abs(this.allowedValues[0]-_b);var _d=this.allowedValues[0];this.allowedValues.each(function(v){var _f=Math.abs(v-_b);if(_f<=_c){_d=v;_c=_f;}});return _d;}if(_b>this.range.end){return this.range.end;}if(_b<this.range.start){return this.range.start;}return _b;},setValue:function(_10,_11){if(!this.active){this.activeHandleIdx=_11||0;this.activeHandle=this.handles[this.activeHandleIdx];this.updateStyles();}_11=_11||this.activeHandleIdx||0;if(this.initialized&&this.restricted){if((_11>0)&&(_10<this.values[_11-1])){_10=this.values[_11-1];}if((_11<(this.handles.length-1))&&(_10>this.values[_11+1])){_10=this.values[_11+1];}}_10=this.getNearestValue(_10);this.values[_11]=_10;this.value=this.values[0];this.handles[_11].style[this.isVertical()?"top":"left"]=this.translateToPx(_10);this.drawSpans();if(!this.dragging||!this.event){this.updateFinished();}},setValueBy:function(_12,_13){this.setValue(this.values[_13||this.activeHandleIdx||0]+_12,_13||this.activeHandleIdx||0);},translateToPx:function(_14){return Math.round(((this.trackLength-this.handleLength)/(this.range.end-this.range.start))*(_14-this.range.start))+"px";},translateToValue:function(_15){return ((_15/(this.trackLength-this.handleLength)*(this.range.end-this.range.start))+this.range.start);},getRange:function(_16){var v=this.values.sortBy(Prototype.K);_16=_16||0;return $R(v[_16],v[_16+1]);},minimumOffset:function(){return (this.isVertical()?this.alignY:this.alignX);},maximumOffset:function(){return (this.isVertical()?(this.track.offsetHeight!=0?this.track.offsetHeight:this.track.style.height.replace(/px$/,""))-this.alignY:(this.track.offsetWidth!=0?this.track.offsetWidth:this.track.style.width.replace(/px$/,""))-this.alignY);},isVertical:function(){return (this.axis=="vertical");},drawSpans:function(){var _18=this;if(this.spans){$R(0,this.spans.length-1).each(function(r){_18.setSpan(_18.spans[r],_18.getRange(r));});}if(this.options.startSpan){this.setSpan(this.options.startSpan,$R(0,this.values.length>1?this.getRange(0).min():this.value));}if(this.options.endSpan){this.setSpan(this.options.endSpan,$R(this.values.length>1?this.getRange(this.spans.length-1).max():this.value,this.maximum));}},setSpan:function(_1a,_1b){if(this.isVertical()){_1a.style.top=this.translateToPx(_1b.start);_1a.style.height=this.translateToPx(_1b.end-_1b.start+this.range.start);}else{_1a.style.left=this.translateToPx(_1b.start);_1a.style.width=this.translateToPx(_1b.end-_1b.start+this.range.start);}},updateStyles:function(){this.handles.each(function(h){Element.removeClassName(h,"selected");});Element.addClassName(this.activeHandle,"selected");},startDrag:function(_1d){if(Event.isLeftClick(_1d)){if(!this.disabled){this.active=true;var _1e=Event.element(_1d);var _1f=[Event.pointerX(_1d),Event.pointerY(_1d)];var _20=_1e;if(_20==this.track){var _21=Position.cumulativeOffset(this.track);this.event=_1d;this.setValue(this.translateToValue((this.isVertical()?_1f[1]-_21[1]:_1f[0]-_21[0])-(this.handleLength/2)));var _21=Position.cumulativeOffset(this.activeHandle);this.offsetX=(_1f[0]-_21[0]);this.offsetY=(_1f[1]-_21[1]);}else{while((this.handles.indexOf(_1e)==-1)&&_1e.parentNode){_1e=_1e.parentNode;}this.activeHandle=_1e;this.activeHandleIdx=this.handles.indexOf(this.activeHandle);this.updateStyles();var _21=Position.cumulativeOffset(this.activeHandle);this.offsetX=(_1f[0]-_21[0]);this.offsetY=(_1f[1]-_21[1]);}}Event.stop(_1d);}},update:function(_22){if(this.active){if(!this.dragging){this.dragging=true;}this.draw(_22);if(navigator.appVersion.indexOf("AppleWebKit")>0){window.scrollBy(0,0);}Event.stop(_22);}},draw:function(_23){var _24=[Event.pointerX(_23),Event.pointerY(_23)];var _25=Position.cumulativeOffset(this.track);_24[0]-=this.offsetX+_25[0];_24[1]-=this.offsetY+_25[1];this.event=_23;this.setValue(this.translateToValue(this.isVertical()?_24[1]:_24[0]));if(this.initialized&&this.options.onSlide){this.options.onSlide(this.values.length>1?this.values:this.value,this);}},endDrag:function(_26){if(this.active&&this.dragging){this.finishDrag(_26,true);Event.stop(_26);}this.active=false;this.dragging=false;},finishDrag:function(_27,_28){this.active=false;this.dragging=false;this.updateFinished();},updateFinished:function(){if(this.initialized&&this.options.onChange){this.options.onChange(this.values.length>1?this.values:this.value,this);}this.event=null;}};