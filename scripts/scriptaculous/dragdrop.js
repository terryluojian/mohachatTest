if(typeof Effect=="undefined"){throw ("dragdrop.js requires including script.aculo.us' effects.js library");}var Droppables={drops:[],remove:function(_1){this.drops=this.drops.reject(function(d){return d.element==$(_1);});},add:function(_3){_3=$(_3);var _4=Object.extend({greedy:true,hoverclass:null,tree:false},arguments[1]||{});if(_4.containment){_4._containers=[];var _5=_4.containment;if((typeof _5=="object")&&(_5.constructor==Array)){_5.each(function(c){_4._containers.push($(c));});}else{_4._containers.push($(_5));}}if(_4.accept){_4.accept=[_4.accept].flatten();}Element.makePositioned(_3);_4.element=_3;this.drops.push(_4);},findDeepestChild:function(_7){deepest=_7[0];for(i=1;i<_7.length;++i){if(Element.isParent(_7[i].element,deepest.element)){deepest=_7[i];}}return deepest;},isContained:function(_8,_9){var _a;if(_9.tree){_a=_8.treeNode;}else{_a=_8.parentNode;}return _9._containers.detect(function(c){return _a==c;});},isAffected:function(_c,_d,_e){return ((_e.element!=_d)&&((!_e._containers)||this.isContained(_d,_e))&&((!_e.accept)||(Element.classNames(_d).detect(function(v){return _e.accept.include(v);})))&&Position.within(_e.element,_c[0],_c[1]));},deactivate:function(_10){if(_10.hoverclass){Element.removeClassName(_10.element,_10.hoverclass);}this.last_active=null;},activate:function(_11){if(_11.hoverclass){Element.addClassName(_11.element,_11.hoverclass);}this.last_active=_11;},show:function(_12,_13){if(!this.drops.length){return;}var _14=[];if(this.last_active){this.deactivate(this.last_active);}this.drops.each(function(_15){if(Droppables.isAffected(_12,_13,_15)){_14.push(_15);}});if(_14.length>0){drop=Droppables.findDeepestChild(_14);Position.within(drop.element,_12[0],_12[1]);if(drop.onHover){drop.onHover(_13,drop.element,Position.overlap(drop.overlap,drop.element));}Droppables.activate(drop);}},fire:function(_16,_17){if(!this.last_active){return;}Position.prepare();if(this.isAffected([Event.pointerX(_16),Event.pointerY(_16)],_17,this.last_active)){if(this.last_active.onDrop){this.last_active.onDrop(_17,this.last_active.element,_16);}}},reset:function(){if(this.last_active){this.deactivate(this.last_active);}}};var Draggables={drags:[],observers:[],register:function(_18){if(this.drags.length==0){this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.updateDrag.bindAsEventListener(this);this.eventKeypress=this.keyPress.bindAsEventListener(this);Event.observe(document,"mouseup",this.eventMouseUp);Event.observe(document,"mousemove",this.eventMouseMove);Event.observe(document,"keypress",this.eventKeypress);}this.drags.push(_18);},unregister:function(_19){this.drags=this.drags.reject(function(d){return d==_19;});if(this.drags.length==0){Event.stopObserving(document,"mouseup",this.eventMouseUp);Event.stopObserving(document,"mousemove",this.eventMouseMove);Event.stopObserving(document,"keypress",this.eventKeypress);}},activate:function(_1b){if(_1b.options.delay){this._timeout=setTimeout(function(){Draggables._timeout=null;window.focus();Draggables.activeDraggable=_1b;}.bind(this),_1b.options.delay);}else{window.focus();this.activeDraggable=_1b;}},deactivate:function(){this.activeDraggable=null;},updateDrag:function(_1c){if(!this.activeDraggable){return;}var _1d=[Event.pointerX(_1c),Event.pointerY(_1c)];if(this._lastPointer&&(this._lastPointer.inspect()==_1d.inspect())){return;}this._lastPointer=_1d;this.activeDraggable.updateDrag(_1c,_1d);},endDrag:function(_1e){if(this._timeout){clearTimeout(this._timeout);this._timeout=null;}if(!this.activeDraggable){return;}this._lastPointer=null;this.activeDraggable.endDrag(_1e);this.activeDraggable=null;},keyPress:function(_1f){if(this.activeDraggable){this.activeDraggable.keyPress(_1f);}},addObserver:function(_20){this.observers.push(_20);this._cacheObserverCallbacks();},removeObserver:function(_21){this.observers=this.observers.reject(function(o){return o.element==_21;});this._cacheObserverCallbacks();},notify:function(_23,_24,_25){if(this[_23+"Count"]>0){this.observers.each(function(o){if(o[_23]){o[_23](_23,_24,_25);}});}if(_24.options[_23]){_24.options[_23](_24,_25);}},_cacheObserverCallbacks:function(){["onStart","onEnd","onDrag"].each(function(_27){Draggables[_27+"Count"]=Draggables.observers.select(function(o){return o[_27];}).length;});}};var Draggable=Class.create();Draggable._dragging={};Draggable.prototype={initialize:function(_29){var _2a={handle:false,reverteffect:function(_2b,_2c,_2d){var dur=Math.sqrt(Math.abs(_2c^2)+Math.abs(_2d^2))*0.02;new Effect.Move(_2b,{x:-_2d,y:-_2c,duration:dur,queue:{scope:"_draggable",position:"end"}});},endeffect:function(_2f){var _30=typeof _2f._opacity=="number"?_2f._opacity:1;new Effect.Opacity(_2f,{duration:0.2,from:0.7,to:_30,queue:{scope:"_draggable",position:"end"},afterFinish:function(){Draggable._dragging[_2f]=false;}});},zindex:1000,revert:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,snap:false,delay:0};if(arguments[1]&&typeof arguments[1].endeffect=="undefined"){Object.extend(_2a,{starteffect:function(_31){_31._opacity=Element.getOpacity(_31);Draggable._dragging[_31]=true;new Effect.Opacity(_31,{duration:0.2,from:_31._opacity,to:0.7});}});}var _32=Object.extend(_2a,arguments[1]||{});this.element=$(_29);if(_32.handle&&(typeof _32.handle=="string")){var h=Element.childrenWithClassName(this.element,_32.handle,true);if(h.length>0){this.handle=h[0];}}if(!this.handle){this.handle=$(_32.handle);}if(!this.handle){this.handle=this.element;}if(_32.scroll&&!_32.scroll.scrollTo&&!_32.scroll.outerHTML){_32.scroll=$(_32.scroll);this._isScrollChild=Element.childOf(this.element,_32.scroll);}Element.makePositioned(this.element);this.delta=this.currentDelta();this.options=_32;this.dragging=false;this.eventMouseDown=this.initDrag.bindAsEventListener(this);Event.observe(this.handle,"mousedown",this.eventMouseDown);Draggables.register(this);},destroy:function(){Event.stopObserving(this.handle,"mousedown",this.eventMouseDown);Draggables.unregister(this);},currentDelta:function(){return ([parseInt(Element.getStyle(this.element,"left")||"0"),parseInt(Element.getStyle(this.element,"top")||"0")]);},initDrag:function(_34){if(typeof Draggable._dragging[this.element]!="undefined"&&Draggable._dragging[this.element]){return;}if(Event.isLeftClick(_34)){var src=Event.element(_34);if(src.tagName&&(src.tagName=="INPUT"||src.tagName=="SELECT"||src.tagName=="OPTION"||src.tagName=="BUTTON"||src.tagName=="TEXTAREA")){return;}var _36=[Event.pointerX(_34),Event.pointerY(_34)];var pos=Position.cumulativeOffset(this.element);this.offset=[0,1].map(function(i){return (_36[i]-pos[i]);});Draggables.activate(this);Event.stop(_34);}},startDrag:function(_39){this.dragging=true;if(this.options.zindex){this.originalZ=parseInt(Element.getStyle(this.element,"z-index")||0);this.element.style.zIndex=this.options.zindex;}if(this.options.ghosting){this._clone=this.element.cloneNode(true);Position.absolutize(this.element);this.element.parentNode.insertBefore(this._clone,this.element);}if(this.options.scroll){if(this.options.scroll==window){var _3a=this._getWindowScroll(this.options.scroll);this.originalScrollLeft=_3a.left;this.originalScrollTop=_3a.top;}else{this.originalScrollLeft=this.options.scroll.scrollLeft;this.originalScrollTop=this.options.scroll.scrollTop;}}Draggables.notify("onStart",this,_39);if(this.options.starteffect){this.options.starteffect(this.element);}},updateDrag:function(_3b,_3c){if(!this.dragging){this.startDrag(_3b);}Position.prepare();Droppables.show(_3c,this.element);Draggables.notify("onDrag",this,_3b);this.draw(_3c);if(this.options.change){this.options.change(this);}if(this.options.scroll){this.stopScrolling();var p;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){p=[left,top,left+width,top+height];}}else{p=Position.page(this.options.scroll);p[0]+=this.options.scroll.scrollLeft;p[1]+=this.options.scroll.scrollTop;p[0]+=(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0);p[1]+=(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0);p.push(p[0]+this.options.scroll.offsetWidth);p.push(p[1]+this.options.scroll.offsetHeight);}var _3e=[0,0];if(_3c[0]<(p[0]+this.options.scrollSensitivity)){_3e[0]=_3c[0]-(p[0]+this.options.scrollSensitivity);}if(_3c[1]<(p[1]+this.options.scrollSensitivity)){_3e[1]=_3c[1]-(p[1]+this.options.scrollSensitivity);}if(_3c[0]>(p[2]-this.options.scrollSensitivity)){_3e[0]=_3c[0]-(p[2]-this.options.scrollSensitivity);}if(_3c[1]>(p[3]-this.options.scrollSensitivity)){_3e[1]=_3c[1]-(p[3]-this.options.scrollSensitivity);}this.startScrolling(_3e);}if(navigator.appVersion.indexOf("AppleWebKit")>0){window.scrollBy(0,0);}Event.stop(_3b);},finishDrag:function(_3f,_40){this.dragging=false;if(this.options.ghosting){Position.relativize(this.element);Element.remove(this._clone);this._clone=null;}if(_40){Droppables.fire(_3f,this.element);}Draggables.notify("onEnd",this,_3f);var _41=this.options.revert;if(_41&&typeof _41=="function"){_41=_41(this.element);}var d=this.currentDelta();if(_41&&this.options.reverteffect){this.options.reverteffect(this.element,d[1]-this.delta[1],d[0]-this.delta[0]);}else{this.delta=d;}if(this.options.zindex){this.element.style.zIndex=this.originalZ;}if(this.options.endeffect){this.options.endeffect(this.element);}Draggables.deactivate(this);Droppables.reset();},keyPress:function(_43){if(_43.keyCode!=Event.KEY_ESC){return;}this.finishDrag(_43,false);Event.stop(_43);},endDrag:function(_44){if(!this.dragging){return;}this.stopScrolling();this.finishDrag(_44,true);Event.stop(_44);},draw:function(_45){var pos=Position.cumulativeOffset(this.element);if(this.options.ghosting){var r=Position.realOffset(this.element);window.status=r.inspect();pos[0]+=r[0]-Position.deltaX;pos[1]+=r[1]-Position.deltaY;}var d=this.currentDelta();pos[0]-=d[0];pos[1]-=d[1];if(this.options.scroll&&(this.options.scroll!=window&&this._isScrollChild)){pos[0]-=this.options.scroll.scrollLeft-this.originalScrollLeft;pos[1]-=this.options.scroll.scrollTop-this.originalScrollTop;}var p=[0,1].map(function(i){return (_45[i]-pos[i]-this.offset[i]);}.bind(this));if(this.options.snap){if(typeof this.options.snap=="function"){p=this.options.snap(p[0],p[1],this);}else{if(this.options.snap instanceof Array){p=p.map(function(v,i){return Math.round(v/this.options.snap[i])*this.options.snap[i];}.bind(this));}else{p=p.map(function(v){return Math.round(v/this.options.snap)*this.options.snap;}.bind(this));}}}var _4e=this.element.style;if((!this.options.constraint)||(this.options.constraint=="horizontal")){_4e.left=p[0]+"px";}if((!this.options.constraint)||(this.options.constraint=="vertical")){_4e.top=p[1]+"px";}if(_4e.visibility=="hidden"){_4e.visibility="";}},stopScrolling:function(){if(this.scrollInterval){clearInterval(this.scrollInterval);this.scrollInterval=null;Draggables._lastScrollPointer=null;}},startScrolling:function(_4f){if(!(_4f[0]||_4f[1])){return;}this.scrollSpeed=[_4f[0]*this.options.scrollSpeed,_4f[1]*this.options.scrollSpeed];this.lastScrolled=new Date();this.scrollInterval=setInterval(this.scroll.bind(this),10);},scroll:function(){var _50=new Date();var _51=_50-this.lastScrolled;this.lastScrolled=_50;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){if(this.scrollSpeed[0]||this.scrollSpeed[1]){var d=_51/1000;this.options.scroll.scrollTo(left+d*this.scrollSpeed[0],top+d*this.scrollSpeed[1]);}}}else{this.options.scroll.scrollLeft+=this.scrollSpeed[0]*_51/1000;this.options.scroll.scrollTop+=this.scrollSpeed[1]*_51/1000;}Position.prepare();Droppables.show(Draggables._lastPointer,this.element);Draggables.notify("onDrag",this);if(this._isScrollChild){Draggables._lastScrollPointer=Draggables._lastScrollPointer||$A(Draggables._lastPointer);Draggables._lastScrollPointer[0]+=this.scrollSpeed[0]*_51/1000;Draggables._lastScrollPointer[1]+=this.scrollSpeed[1]*_51/1000;if(Draggables._lastScrollPointer[0]<0){Draggables._lastScrollPointer[0]=0;}if(Draggables._lastScrollPointer[1]<0){Draggables._lastScrollPointer[1]=0;}this.draw(Draggables._lastScrollPointer);}if(this.options.change){this.options.change(this);}},_getWindowScroll:function(w){var T,L,W,H;with(w.document){if(w.document.documentElement&&documentElement.scrollTop){T=documentElement.scrollTop;L=documentElement.scrollLeft;}else{if(w.document.body){T=body.scrollTop;L=body.scrollLeft;}}if(w.innerWidth){W=w.innerWidth;H=w.innerHeight;}else{if(w.document.documentElement&&documentElement.clientWidth){W=documentElement.clientWidth;H=documentElement.clientHeight;}else{W=body.offsetWidth;H=body.offsetHeight;}}}return {top:T,left:L,width:W,height:H};}};var SortableObserver=Class.create();SortableObserver.prototype={initialize:function(_58,_59){this.element=$(_58);this.observer=_59;this.lastValue=Sortable.serialize(this.element);},onStart:function(){this.lastValue=Sortable.serialize(this.element);},onEnd:function(){Sortable.unmark();if(this.lastValue!=Sortable.serialize(this.element)){this.observer(this.element);}}};var Sortable={SERIALIZE_RULE:/^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,sortables:{},_findRootElement:function(_5a){while(_5a.tagName!="BODY"){if(_5a.id&&Sortable.sortables[_5a.id]){return _5a;}_5a=_5a.parentNode;}},options:function(_5b){_5b=Sortable._findRootElement($(_5b));if(!_5b){return;}return Sortable.sortables[_5b.id];},destroy:function(_5c){var s=Sortable.options(_5c);if(s){Draggables.removeObserver(s.element);s.droppables.each(function(d){Droppables.remove(d);});s.draggables.invoke("destroy");delete Sortable.sortables[s.element.id];}},create:function(_5f){_5f=$(_5f);var _60=Object.extend({element:_5f,tag:"li",dropOnEmpty:false,tree:false,treeTag:"ul",overlap:"vertical",constraint:"vertical",containment:_5f,handle:false,only:false,delay:0,hoverclass:null,ghosting:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,format:this.SERIALIZE_RULE,onChange:Prototype.emptyFunction,onUpdate:Prototype.emptyFunction},arguments[1]||{});this.destroy(_5f);var _61={revert:true,scroll:_60.scroll,scrollSpeed:_60.scrollSpeed,scrollSensitivity:_60.scrollSensitivity,delay:_60.delay,ghosting:_60.ghosting,constraint:_60.constraint,handle:_60.handle};if(_60.starteffect){_61.starteffect=_60.starteffect;}if(_60.reverteffect){_61.reverteffect=_60.reverteffect;}else{if(_60.ghosting){_61.reverteffect=function(_62){_62.style.top=0;_62.style.left=0;};}}if(_60.endeffect){_61.endeffect=_60.endeffect;}if(_60.zindex){_61.zindex=_60.zindex;}var _63={overlap:_60.overlap,containment:_60.containment,tree:_60.tree,hoverclass:_60.hoverclass,onHover:Sortable.onHover};var _64={onHover:Sortable.onEmptyHover,overlap:_60.overlap,containment:_60.containment,hoverclass:_60.hoverclass};Element.cleanWhitespace(_5f);_60.draggables=[];_60.droppables=[];if(_60.dropOnEmpty||_60.tree){Droppables.add(_5f,_64);_60.droppables.push(_5f);}(this.findElements(_5f,_60)||[]).each(function(e){var _66=_60.handle?Element.childrenWithClassName(e,_60.handle)[0]:e;_60.draggables.push(new Draggable(e,Object.extend(_61,{handle:_66})));Droppables.add(e,_63);if(_60.tree){e.treeNode=_5f;}_60.droppables.push(e);});if(_60.tree){(Sortable.findTreeElements(_5f,_60)||[]).each(function(e){Droppables.add(e,_64);e.treeNode=_5f;_60.droppables.push(e);});}this.sortables[_5f.id]=_60;Draggables.addObserver(new SortableObserver(_5f,_60.onUpdate));},findElements:function(_68,_69){return Element.findChildren(_68,_69.only,_69.tree?true:false,_69.tag);},findTreeElements:function(_6a,_6b){return Element.findChildren(_6a,_6b.only,_6b.tree?true:false,_6b.treeTag);},onHover:function(_6c,_6d,_6e){if(Element.isParent(_6d,_6c)){return;}if(_6e>0.33&&_6e<0.66&&Sortable.options(_6d).tree){return;}else{if(_6e>0.5){Sortable.mark(_6d,"before");if(_6d.previousSibling!=_6c){var _6f=_6c.parentNode;_6c.style.visibility="hidden";_6d.parentNode.insertBefore(_6c,_6d);if(_6d.parentNode!=_6f){Sortable.options(_6f).onChange(_6c);}Sortable.options(_6d.parentNode).onChange(_6c);}}else{Sortable.mark(_6d,"after");var _70=_6d.nextSibling||null;if(_70!=_6c){var _6f=_6c.parentNode;_6c.style.visibility="hidden";_6d.parentNode.insertBefore(_6c,_70);if(_6d.parentNode!=_6f){Sortable.options(_6f).onChange(_6c);}Sortable.options(_6d.parentNode).onChange(_6c);}}}},onEmptyHover:function(_71,_72,_73){var _74=_71.parentNode;var _75=Sortable.options(_72);if(!Element.isParent(_72,_71)){var _76;var _77=Sortable.findElements(_72,{tag:_75.tag,only:_75.only});var _78=null;if(_77){var _79=Element.offsetSize(_72,_75.overlap)*(1-_73);for(_76=0;_76<_77.length;_76+=1){if(_79-Element.offsetSize(_77[_76],_75.overlap)>=0){_79-=Element.offsetSize(_77[_76],_75.overlap);}else{if(_79-(Element.offsetSize(_77[_76],_75.overlap)/2)>=0){_78=_76+1<_77.length?_77[_76+1]:null;break;}else{_78=_77[_76];break;}}}}_72.insertBefore(_71,_78);Sortable.options(_74).onChange(_71);_75.onChange(_71);}},unmark:function(){if(Sortable._marker){Element.hide(Sortable._marker);}},mark:function(_7a,_7b){var _7c=Sortable.options(_7a.parentNode);if(_7c&&!_7c.ghosting){return;}if(!Sortable._marker){Sortable._marker=$("dropmarker")||document.createElement("DIV");Element.hide(Sortable._marker);Element.addClassName(Sortable._marker,"dropmarker");Sortable._marker.style.position="absolute";document.getElementsByTagName("body").item(0).appendChild(Sortable._marker);}var _7d=Position.cumulativeOffset(_7a);Sortable._marker.style.left=_7d[0]+"px";Sortable._marker.style.top=_7d[1]+"px";if(_7b=="after"){if(_7c.overlap=="horizontal"){Sortable._marker.style.left=(_7d[0]+_7a.clientWidth)+"px";}else{Sortable._marker.style.top=(_7d[1]+_7a.clientHeight)+"px";}}Element.show(Sortable._marker);},_tree:function(_7e,_7f,_80){var _81=Sortable.findElements(_7e,_7f)||[];for(var i=0;i<_81.length;++i){var _83=_81[i].id.match(_7f.format);if(!_83){continue;}var _84={id:encodeURIComponent(_83?_83[1]:null),element:_7e,parent:_80,children:new Array,position:_80.children.length,container:Sortable._findChildrenElement(_81[i],_7f.treeTag.toUpperCase())};if(_84.container){this._tree(_84.container,_7f,_84);}_80.children.push(_84);}return _80;},_findChildrenElement:function(_85,_86){if(_85&&_85.hasChildNodes){for(var i=0;i<_85.childNodes.length;++i){if(_85.childNodes[i].tagName==_86){return _85.childNodes[i];}}}return null;},tree:function(_88){_88=$(_88);var _89=this.options(_88);var _8a=Object.extend({tag:_89.tag,treeTag:_89.treeTag,only:_89.only,name:_88.id,format:_89.format},arguments[1]||{});var _8b={id:null,parent:null,children:new Array,container:_88,position:0};return Sortable._tree(_88,_8a,_8b);},_constructIndex:function(_8c){var _8d="";do{if(_8c.id){_8d="["+_8c.position+"]"+_8d;}}while((_8c=_8c.parent)!=null);return _8d;},sequence:function(_8e){_8e=$(_8e);var _8f=Object.extend(this.options(_8e),arguments[1]||{});return $(this.findElements(_8e,_8f)||[]).map(function(_90){return _90.id.match(_8f.format)?_90.id.match(_8f.format)[1]:"";});},setSequence:function(_91,_92){_91=$(_91);var _93=Object.extend(this.options(_91),arguments[2]||{});var _94={};this.findElements(_91,_93).each(function(n){if(n.id.match(_93.format)){_94[n.id.match(_93.format)[1]]=[n,n.parentNode];}n.parentNode.removeChild(n);});_92.each(function(_96){var n=_94[_96];if(n){n[1].appendChild(n[0]);delete _94[_96];}});},serialize:function(_98){_98=$(_98);var _99=Object.extend(Sortable.options(_98),arguments[1]||{});var _9a=encodeURIComponent((arguments[1]&&arguments[1].name)?arguments[1].name:_98.id);if(_99.tree){return Sortable.tree(_98,arguments[1]).children.map(function(_9b){return [_9a+Sortable._constructIndex(_9b)+"[id]="+encodeURIComponent(_9b.id)].concat(_9b.children.map(arguments.callee));}).flatten().join("&");}else{return Sortable.sequence(_98,arguments[1]).map(function(_9c){return _9a+"[]="+encodeURIComponent(_9c);}).join("&");}}};Element.isParent=function(_9d,_9e){if(!_9d.parentNode||_9d==_9e){return false;}if(_9d.parentNode==_9e){return true;}return Element.isParent(_9d.parentNode,_9e);};Element.findChildren=function(_9f,_a0,_a1,_a2){if(!_9f.hasChildNodes()){return null;}_a2=_a2.toUpperCase();if(_a0){_a0=[_a0].flatten();}var _a3=[];$A(_9f.childNodes).each(function(e){if(e.tagName&&e.tagName.toUpperCase()==_a2&&(!_a0||(Element.classNames(e).detect(function(v){return _a0.include(v);})))){_a3.push(e);}if(_a1){var _a6=Element.findChildren(e,_a0,_a1,_a2);if(_a6){_a3.push(_a6);}}});return (_a3.length>0?_a3.flatten():[]);};Element.offsetSize=function(_a7,_a8){if(_a8=="vertical"||_a8=="height"){return _a7.offsetHeight;}else{return _a7.offsetWidth;}};