YUI.add("dd-ddm-base",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};A.NAME="DragDropMgr";A.ATTRS={clickPixelThresh:{value:3},clickTimeThresh:{value:1000},dragMode:{value:"point",set:function(C){this._setDragMode(C);}}};B.extend(A,B.Base,{_setDragMode:function(C){if(C===null){C=B.DD.DDM.get("dragMode");}switch(C){case 1:case"intersect":return 1;case 2:case"strict":return 2;case 0:case"point":return 0;}return 0;},CSS_PREFIX:"yui-dd",_activateTargets:function(){},_drags:[],activeDrag:false,_regDrag:function(C){this._drags[this._drags.length]=C;},_unregDrag:function(D){var C=[];B.each(this._drags,function(F,E){if(F!==D){C[C.length]=F;}});this._drags=C;},initializer:function(){B.Node.get("document").on("mousemove",this._move,this,true);B.Node.get("document").on("mouseup",this._end,this,true);},_start:function(C,F,D,E){this._startDrag.apply(this,arguments);},_startDrag:function(){},_endDrag:function(){},_dropMove:function(){},_end:function(){if(this.activeDrag){this._endDrag();this.activeDrag.end.call(this.activeDrag);this.activeDrag=null;}},stopDrag:function(){if(this.activeDrag){this._end();}return this;},_move:function(C){if(this.activeDrag){this.activeDrag._move.apply(this.activeDrag,arguments);this._dropMove();}},setXY:function(E,F){var D=parseInt(E.getStyle("top"),10),C=parseInt(E.getStyle("left"),10),G=E.getStyle("position");if(G==="static"){E.setStyle("position","relative");}if(isNaN(D)){D=0;}if(isNaN(C)){C=0;}E.setStyle("top",(F[1]+D)+"px");E.setStyle("left",(F[0]+C)+"px");},cssSizestoObject:function(E){var D=E.split(" "),C={top:0,bottom:0,right:0,left:0};if(D.length){C.top=parseInt(D[0],10);if(D[1]){C.right=parseInt(D[1],10);}else{C.right=C.top;}if(D[2]){C.bottom=parseInt(D[2],10);}else{C.bottom=C.top;}if(D[3]){C.left=parseInt(D[3],10);}else{if(D[1]){C.left=C.right;}else{C.left=C.top;}}}return C;},getDrag:function(D){var C=false,E=B.Node.get(D);if(E instanceof B.Node){B.each(this._drags,function(G,F){if(E.compareTo(G.get("node"))){C=G;}});}return C;}});B.namespace("DD");B.DD.DDM=new A();},"@VERSION@",{requires:["node","base"],skinnable:false});YUI.add("dd-ddm",function(A){A.mix(A.DD.DDM,{_pg:null,_debugShim:false,_activateTargets:function(){},_deactivateTargets:function(){},_startDrag:function(){if(this.activeDrag.get("useShim")){this._pg_activate();this._activateTargets();}},_endDrag:function(){this._pg_deactivate();this._deactivateTargets();},_pg_deactivate:function(){this._pg.setStyle("display","none");},_pg_activate:function(){this._pg_size();this._pg.setStyles({top:0,left:0,display:"block",opacity:((this._debugShim)?".5":"0")});},_pg_size:function(){if(this.activeDrag){var B=A.Node.get("body"),D=B.get("docHeight"),C=B.get("docWidth");this._pg.setStyles({height:D+"px",width:C+"px"});}},_createPG:function(){var C=A.Node.create("<div></div>"),B=A.Node.get("body");C.setStyles({top:"0",left:"0",position:"absolute",zIndex:"9999",overflow:"hidden",backgroundColor:"red",display:"none",height:"5px",width:"5px"});if(B.get("firstChild")){B.insertBefore(C,B.get("firstChild"));}else{B.appendChild(C);}this._pg=C;this._pg.on("mouseup",this._end,this,true);this._pg.on("mousemove",this._move,this,true);A.Event.addListener(window,"resize",this._pg_size,this,true);A.Event.addListener(window,"scroll",this._pg_size,this,true);}},true);A.DD.DDM._createPG();},"@VERSION@",{requires:["dd-ddm-base"],skinnable:false});YUI.add("dd-drag",function(D){var E=D.DD.DDM,R="node",L="dragNode",C="offsetHeight",J="offsetWidth",P="mouseup",N="mousedown",G="drag:mouseDown",B="drag:afterMouseDown",F="drag:removeHandle",K="drag:addHandle",O="drag:removeInvalid",Q="drag:addInvalid",I="drag:start",H="drag:end",M="drag:drag";var A=function(){A.superclass.constructor.apply(this,arguments);E._regDrag(this);};A.NAME="drag";A.ATTRS={node:{set:function(S){var T=D.Node.get(S);if(!T){D.fail("DD.Drag: Invalid Node Given: "+S);}return T;}},dragNode:{set:function(S){var T=D.Node.get(S);if(!T){D.fail("DD.Drag: Invalid dragNode Given: "+S);}return T;}},offsetNode:{value:true},clickPixelThresh:{value:E.get("clickPixelThresh")},clickTimeThresh:{value:E.get("clickTimeThresh")},lock:{value:false,set:function(S){if(S){this.get(R).addClass(E.CSS_PREFIX+"-locked");}else{this.get(R).removeClass(E.CSS_PREFIX+"-locked");}}},data:{value:false},move:{value:true},useShim:{value:true},activeHandle:{value:false},primaryButtonOnly:{value:true},dragging:{value:false},target:{value:false,set:function(S){this._handleTarget(S);}},dragMode:{value:null,set:function(S){return E._setDragMode(S);}},groups:{value:["default"],get:function(){if(!this._groups){this._groups={};}var S=[];D.each(this._groups,function(U,T){S[S.length]=T;});return S;},set:function(S){this._groups={};D.each(S,function(U,T){this._groups[U]=true;},this);}}};D.extend(A,D.Base,{addToGroup:function(S){this._groups[S]=true;E._activateTargets();return this;},removeFromGroup:function(S){delete this._groups[S];E._activateTargets();return this;},target:null,_handleTarget:function(S){if(D.DD.Drop){if(S===false){if(this.target){E._unregTarget(this.target);this.target=null;}return false;}else{if(!D.Lang.isObject(S)){S={};}S.node=this.get(R);this.target=new D.DD.Drop(S);}}else{return false;}},_groups:null,_createEvents:function(){this.publish(G,{defaultFn:this._handleMouseDown,queuable:true,emitFacade:true,bubbles:true});var S=[B,F,K,O,Q,I,H,M,"drag:drophit","drag:dropmiss","drag:over","drag:enter","drag:exit"];D.each(S,function(U,T){this.publish(U,{type:U,emitFacade:true,bubbles:true,preventable:false,queuable:true});},this);this.addTarget(E);},_ev_md:null,_startTime:null,_endTime:null,_handles:null,_invalids:null,_invalidsDefault:{"textarea":true,"input":true,"a":true,"button":true},_dragThreshMet:null,_fromTimeout:null,_clickTimeout:null,deltaXY:null,startXY:null,nodeXY:null,lastXY:null,mouseXY:null,region:null,_handleMouseUp:function(S){this._fixIEMouseUp();if(E.activeDrag){E._end();}},_ieSelectFix:function(){return false;},_ieSelectBack:null,_fixIEMouseDown:function(){if(D.UA.ie){this._ieSelectBack=D.config.doc.body.onselectstart;
D.config.doc.body.onselectstart=this._ieSelectFix;}},_fixIEMouseUp:function(){if(D.UA.ie){D.config.doc.body.onselectstart=this._ieSelectBack;}},_handleMouseDownEvent:function(S){this.fire(G,{ev:S});},_handleMouseDown:function(U){var T=U.ev;this._dragThreshMet=false;this._ev_md=T;if(this.get("primaryButtonOnly")&&T.button>1){return false;}if(this.validClick(T)){this._fixIEMouseDown();T.halt();this._setStartPosition([T.pageX,T.pageY]);E.activeDrag=this;var S=this;this._clickTimeout=setTimeout(function(){S._timeoutCheck.call(S);},this.get("clickTimeThresh"));}this.fire(B,{ev:T});},validClick:function(W){var V=false,S=W.target,U=null;if(this._handles){D.each(this._handles,function(X,Y){if(D.Lang.isString(Y)){if(S.test(Y+", "+Y+" *")){U=Y;V=true;}}});}else{if(this.get(R).contains(S)||this.get(R).compareTo(S)){V=true;}}if(V){if(this._invalids){D.each(this._invalids,function(X,Y){if(D.Lang.isString(Y)){if(S.test(Y+", "+Y+" *")){V=false;}}});}}if(V){if(U){var T=W.currentTarget.queryAll(U);T.each(function(Y,X){if(Y.contains(S)||Y.compareTo(S)){this.set("activeHandle",T.item(X));}},this);}else{this.set("activeHandle",this.get(R));}}return V;},_setStartPosition:function(S){this.startXY=S;this.nodeXY=this.get(R).getXY();this.lastXY=this.nodeXY;if(this.get("offsetNode")){this.deltaXY=[(this.startXY[0]-this.nodeXY[0]),(this.startXY[1]-this.nodeXY[1])];}else{this.deltaXY=[0,0];}},_timeoutCheck:function(){if(!this.get("lock")){this._fromTimeout=true;this._dragThreshMet=true;this.start();this._moveNode([this._ev_md.pageX,this._ev_md.pageY],true);}},removeHandle:function(S){if(this._handles[S]){delete this._handles[S];this.fire(F,{handle:S});}return this;},addHandle:function(S){if(!this._handles){this._handles={};}if(D.Lang.isString(S)){this._handles[S]=true;this.fire(K,{handle:S});}return this;},removeInvalid:function(S){if(this._invalids[S]){delete this._handles[S];this.fire(O,{handle:S});}return this;},addInvalid:function(S){if(D.Lang.isString(S)){this._invalids[S]=true;this.fire(Q,{handle:S});}else{}return this;},initializer:function(){if(!this.get(R).get("id")){var S=D.stamp(this.get(R));this.get(R).set("id",S);}this._invalids=this._invalidsDefault;this._createEvents();if(!this.get(L)){this.set(L,this.get(R));}this._prep();this._dragThreshMet=false;},_prep:function(){var S=this.get(R);S.addClass(E.CSS_PREFIX+"-draggable");S.on(N,this._handleMouseDownEvent,this,true);S.on(P,this._handleMouseUp,this,true);},_unprep:function(){var S=this.get(R);S.removeClass(E.CSS_PREFIX+"-draggable");S.detach(N,this._handleMouseDownEvent,this,true);S.detach(P,this._handleMouseUp,this,true);},start:function(){if(!this.get("lock")&&!this.get("dragging")){this.set("dragging",true);E._start(this.deltaXY,[this.get(R).get(C),this.get(R).get(J)]);this.get(R).addClass(E.CSS_PREFIX+"-dragging");this.fire(I,{pageX:this.nodeXY[0],pageY:this.nodeXY[1]});this.get(L).on(P,this._handleMouseUp,this,true);var S=this.nodeXY;this._startTime=(new Date()).getTime();this.region={"0":S[0],"1":S[1],area:0,top:S[1],right:S[0]+this.get(R).get(J),bottom:S[1]+this.get(R).get(C),left:S[0]};}return this;},end:function(){this._endTime=(new Date()).getTime();clearTimeout(this._clickTimeout);this._dragThreshMet=false;this._fromTimeout=false;if(!this.get("lock")&&this.get("dragging")){this.fire(H,{pageX:this.lastXY[0],pageY:this.lastXY[1]});}this.get(R).removeClass(E.CSS_PREFIX+"-dragging");this.set("dragging",false);this.deltaXY=[0,0];this.get(L).detach(P,this._handleMouseUp,this,true);return this;},_align:function(S){return[S[0]-this.deltaXY[0],S[1]-this.deltaXY[1]];},_moveNode:function(S,X){var W=this._align(S),T=[],U=[];T[0]=(W[0]-this.lastXY[0]);T[1]=(W[1]-this.lastXY[1]);U[0]=(W[0]-this.nodeXY[0]);U[1]=(W[1]-this.nodeXY[1]);if(this.get("move")){if(D.UA.opera){this.get(L).setXY(W);}else{E.setXY(this.get(L),T);}}this.region={"0":W[0],"1":W[1],area:0,top:W[1],right:W[0]+this.get(R).get(J),bottom:W[1]+this.get(R).get(C),left:W[0]};var V=this.nodeXY;if(!X){this.fire(M,{pageX:W[0],pageY:W[1],info:{start:V,xy:W,delta:T,offset:U}});}this.lastXY=W;},_move:function(U){if(this.get("lock")){return false;}else{this.mouseXY=[U.pageX,U.pageY];if(!this._dragThreshMet){var T=Math.abs(this.startXY[0]-U.pageX);var S=Math.abs(this.startXY[1]-U.pageY);if(T>this.get("clickPixelThresh")||S>this.get("clickPixelThresh")){this._dragThreshMet=true;this.start();this._moveNode([U.pageX,U.pageY]);}}else{clearTimeout(this._clickTimeout);this._moveNode([U.pageX,U.pageY]);}}},stopDrag:function(){if(this.get("dragging")){E._end();}return this;},destructor:function(){E._unregDrag(this);this._unprep();if(this.target){this.target.destroy();}}});D.namespace("DD");D.DD.Drag=A;},"@VERSION@",{requires:["dd-ddm-base"],skinnable:false});YUI.add("dd-proxy",function(F){var E=F.DD.DDM,A="node",B="dragNode",C="proxy";var G=function(){G.superclass.constructor.apply(this,arguments);};G.NAME="dragProxy";G.ATTRS={moveOnEnd:{value:true},resizeFrame:{value:true},proxy:{writeOnce:true,value:false},positionProxy:{value:true},borderStyle:{value:"1px solid #808080"}};var D={_createFrame:function(){if(!E._proxy){E._proxy=true;var H=F.Node.create("<div></div>");H.setStyles({position:"absolute",display:"none",zIndex:"999",top:"-999px",left:"-999px",border:this.get("borderStyle")});E._pg.get("parentNode").insertBefore(H,E._pg);H.set("id",F.stamp(H));H.addClass(E.CSS_PREFIX+"-proxy");E._proxy=H;}},_setFrame:function(){var H=this.get(A);if(this.get("resizeFrame")){E._proxy.setStyles({height:H.get("offsetHeight")+"px",width:H.get("offsetWidth")+"px"});}this.get(B).setStyles({visibility:"hidden",display:"block",border:this.get("borderStyle")});if(this.get("positionProxy")){this.get(B).setXY(this.nodeXY);}this.get(B).setStyle("visibility","visible");},initializer:function(){if(this.get(C)){this._createFrame();}},start:function(){if(!this.get("lock")){if(this.get(C)){if(this.get(B).compareTo(this.get(A))){this.set(B,E._proxy);}}}G.superclass.start.apply(this);if(this.get(C)){this._setFrame();}},end:function(){if(this.get(C)&&this.get("dragging")){if(this.get("moveOnEnd")){this.get(A).setXY(this.lastXY);
}this.get(B).setStyle("display","none");}G.superclass.end.apply(this);}};F.extend(G,F.DD.Drag,D);F.DD.Drag=G;},"@VERSION@",{requires:["dd-ddm","dd-drag"],skinnable:false});YUI.add("dd-plugin",function(B){B.Plugin=B.Plugin||{};var A=function(C){C.node=C.owner;A.superclass.constructor.apply(this,arguments);};A.NAME="dd-plugin";A.NS="dd";B.extend(A,B.DD.Drag);B.Plugin.Drag=A;},"@VERSION@",{skinnable:false,requires:["dd-drag"],optional:["dd-constrain","dd-proxy"]});YUI.add("dd-drag-proxy",function(A){},"@VERSION@",{skinnable:false,use:["dd-ddm-base","dd-ddm","dd-drag","dd-proxy","dd-plugin"]});