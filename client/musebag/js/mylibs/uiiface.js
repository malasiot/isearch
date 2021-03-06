/**
UIIFace - Unified Interaction Interface
Copyright (c) 2011, Jonas Etzold and Erfurt University of Applied Sciences (FHE)

Interaction Component of I-SEARCH (http://www.isearch-project.eu)
All rights reserved.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS' AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PAUL BRUNT BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

define("mylibs/uiiface", ["libs/jquery.hasEventListener.min"], function(){
  
  var UIIFace = {};
  
  (function(UIIFace){

  	/** Helper function */
  	UIIFace.namespace = function(ns_string) {
  		var parts  = ns_string.split('.'),
  		    parent = UIIFace,
  		    i;

  	    //strip redundant leading global
  		if(parts[0] === 'UIIFace') {
  			parts = parts.slice(1);
  		}    

  		for(i = 0; i < parts.length; i += 1) {
  			//create a property if it doesn't exist
  			if(typeof parent[parts[i]] === 'undefined') {
  				parent[parts[i]] = {};
  			}
  			parent = parent[parts[i]];
  		}
  		return parent;
  	};	
  	UIIFace.isEventSupported = function(eventName){
  		var el = document.createElement('div');
  		eventName = 'on' + eventName;
  	    var isSupported = (eventName in el);

  		//Check for proprietary Mozilla events
  		if(eventName.indexOf('MozTouch') > -1) {
  			if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
  				if(new Number(RegExp.$1) >= 4) {
  					document.multitouchData = true;
  					isSupported = true;
  				}
  			}
  		}

  	    if (!isSupported) {
  	    	el.setAttribute(eventName, 'return;');
  	    	isSupported = typeof el[eventName] == 'function';
  	    }
  	    el = null;
  	    return isSupported;
  	};

  	// Namespaces for sub components of UIIFace 
  	UIIFace.namespace('UIIFace.InteractionManager');
  	UIIFace.namespace('UIIFace.GestureInterpreter');
  	UIIFace.namespace('UIIFace.Tools');

  	/** Tools for use within UIIFace */
  	UIIFace.Tools.isEmpty = function(value) {
  		if(value) {
  			return false;
  		} 		
  		return true;
  	};

  	/** General properties of UIIFace */
  	//Supported custom events
  	var eventList = ['move','click','over',
  				     'dragenter','drop','dragleave',
  				     'select','pan','scale',
  				     'rotate','hold','swipe',
  				     'delete','add','submit',
  				     'text','reset','search',
  				     'sketch'];	
  	//Array for storing available touch events if applicable 
  	var touchEvents = new Array(3);

  	//Pen collection for multitouch sketch event
  	var pens = new Array();

  	//Options object for general configuration of UIIFace
  	var uiiOptions = {
  			gestureHint: false
  	};

  	/** Command Mapper >> initialization */
  	UIIFace.CommandMapper = function() {

  		if(UIIFace.isEventSupported('MozTouchDown')) {
  			touchEvents['down'] = 'MozTouchDown'; 
  		} else if(UIIFace.isEventSupported('touchStart')) {
  			touchEvents['down'] = 'touchStart'; 
  		} else if(UIIFace.isEventSupported('touchstart')) {
  			touchEvents['down'] = 'touchstart'; 
  		}
  		
  		if(UIIFace.isEventSupported('MozTouchMove')) {
  			touchEvents['move'] = 'MozTouchMove'; 
  		} else if(UIIFace.isEventSupported('touchMove')) {
  			touchEvents['move'] = 'touchMove'; 
  		} else if(UIIFace.isEventSupported('touchmove')) {
  			touchEvents['move'] = 'touchmove'; 
  		}

  		if(UIIFace.isEventSupported('MozTouchUp')) {
  			touchEvents['up'] = 'MozTouchUp'; 
  		} else if(UIIFace.isEventSupported('touchEnd')) {
  			touchEvents['up'] = 'touchEnd'; 
  		} else if(UIIFace.isEventSupported('touchend')) {
  			touchEvents['up'] = 'touchend'; 
  		}


  	};

  	/** Basic Interpreter */

  	/** Gesture Interpreter 
  	 * 
  	 * This work is mainly an adaption of Moousture by Zohaib Sibt-e-Hassan.
  	 * It is partly enhanced by an approach developed in my master thesis.
  	 *  
  	 */
    UIIFace.GestureInterpreter = function (element) {
  		var element = element;

  		/** Internal class for mouse or touch probe */
  		var Probe = function(target) {
  			this.pos = {x:-1, y:-1};

  			// private event tracking callback function
  			var _track = function(e)
  			{
  				this.pos.x = e.pageX;
  				this.pos.y = e.pageY;
  				e.stopPropagation();
  			};

  	        $(target).bind('mousemove', $.proxy(_track,this));
  		};

  		Probe.prototype = {
  		    probe: function ()
  		    {
  		    	pos = { };
  		    	$.extend(pos,this.pos);
  		    	return pos;
  		    }
  		};

  		/** Internal recorder class */
  		var Recorder = function(options) {
  			/*
  			 * @options: containing minSteps, maxSteps, matcher (more open for further compatibility).
  			 * initialize the callbacks table and gesture combinations table.
  			 */
  			this.options = { 
  					         matcher: null,
  							 maxSteps: 8,
  							 minSteps: 4
  						   };
  			if(!UIIFace.Tools.isEmpty(options)) {
  				this.options = options;
  			}
  			this.movLog = [];

  		};

  		Recorder.prototype = {		

  			// onStable is called once by the Monitor when mouse becomes stable .i.e. no changes in mouse position are occuring
  			// @position: current mouse position
  		    onStable: function(position){
  		        if( this.movLog.length < this.options.minSteps ){
  		        	this.movLog.length = 0;
  		            return;
  		        }

  		        if(this.options.matcher && this.options.matcher.match) {
  		            this.options.matcher.match(this.movLog);
  		        }
  		        if(uiiOptions.gestureHint === true) {
  		    		$('.gestureHint').hide();
  		    	}

  		        this.movLog.length = 0;
  		    },
  			// onUnstable is called by the Monitor first time when the mouse starts movement
  			// @position: current mouse position
  		    onUnstable: function(position){
  		    	this.movLog.length = 0;
  		    	this.movLog.push(position);

  		    	if(uiiOptions.gestureHint === true) {
  		    		$('.gestureHint').show().css('top',position.y+30).css('left',position.x+25);
  		    	}
  		    	//console.log('start');
  		    },
  			// onMove is called by the Monitor when mouse was found moving last time as well
  			// @position: current mouse position
  		    onMove: function(position){
  		        if(this.movLog.length > this.options.maxSteps) {
  		            return;
  		        };  
  				this.movLog.push(position);
  				if(uiiOptions.gestureHint === true) {
  		    		$('.gestureHint').show().css('top',position.y+30).css('left',position.x+25);
  		    	}
  		    }
  		};

  		/** Internal class monitor */
  		var Monitor = function(delay, tHold) {
  			/*
  			 *	@delay: delay between probes in ms lower mean more sensitive
  			 *	@tHold: threshold of mouse displacement to be ignored while in stable state ( in pixels )
  			 */
  			this.prev = {x:0, y:0};
  	        this.delay = UIIFace.Tools.isEmpty(delay) ? 20 : delay;
  	        this.thresh = UIIFace.Tools.isEmpty(tHold) ? 1 : tHold;
  	        this.wasStable = false;
  		};

  		Monitor.prototype = {
  		    /*
  			 *	periodic function to probe the mouse movement
  			 */
  		    monitor: function() {
  		        pos = this.prober.probe();

  		        if ( Math.abs(pos.x - this.prev.x) < this.thresh && Math.abs( pos.y - this.prev.y ) < this.thresh )
  		        {
  		        	if( !this.wasStable ) {
  		                this.cbObject.onStable(pos);
  		        	}
  		            this.wasStable = true;
  		        }
  		        else
  		        {
  		        	if( this.wasStable ) {
  		                this.cbObject.onUnstable(pos);
  		        	} else {
  		        		this.cbObject.onMove(pos);
  		        	}
  		            this.wasStable = false;
  		        }

  		        this.prev = pos;
  		    },

  		    /*
  		     *	prober: an Object containing method probe returning an object with {x, y} for position parameters
  		     *	eventObj: an eventObject containing callback functions - onStable, - onMove and - onUnstable
  		     */
  		    start: function(prober, eventObj){
  				if( this.timer )
  					this.stop();
  		        this.prober = prober;
  		        this.cbObject = eventObj;

  		        var that = this;
  		        this.timer = setInterval($.proxy(this.monitor,this), this.delay );
  		    },

  			/*
  			 * Stop and delete timer probing
  			 */
  		    stop: function(){
  		    	clearTimeout(this.timer);
  		    	clearInterval(this.timer);
  				delete this.timer;
  		    }
  		};

  	    /** Internal class GestureMatcher */
  		var GestureMatcher = function() {
  			this.mCallbacks = [];
  			this.mGestures  = [];
  		};

  		GestureMatcher.prototype = {
  			/*
  	         * Generates angle directions...
  	         * @input : track array
  	         * @output: directions array
  	         * 0 - Rightwards ( 3'O clock hour arm )
  	         * 1 - Bottom Rightwards
  	         * 2 - Bottomwards
  	         * 3 - Bottom Left
  	         * 4 - Left
  	         * 5 - Left Topwards
  	         * 6 - Upwards,
  	         * 7 - Right Upwards 
  		     */
  			angelize : function(track){
  		        ret = [];

  		        for( i = 1; i< track.length - 1; i++ )
  		            ret.push( this.getAngles( track[i], track[i+1] ) );
  		        return ret;
  		    },

  		    /*
  		     * Gets angle and length of mouse movement vector...
  		     * @input: two points
  		     * @output:  angle in radians
  		     */
  		   getAngles : function(oldP, newP){
  		        diffx=newP.x-oldP.x;
  		        diffy=newP.y-oldP.y;
  		        a = Math.atan2(diffy,diffx) + Math.PI/8;

  		        if( a < 0 ) a = a + (2 * Math.PI);

  		        a = Math.floor( a /(2*Math.PI)*360 ) / 45;
  		        return Math.floor( a );
  		    },

  			/*
  			 * Associate the given Gesture combination with callback
  			 */
  		    addGesture : function(gesture, callback){
  				this.mCallbacks.push(callback);
  				this.mGestures.push(gesture);
  			},

  			/*
  			 * match is called after the mouse went through unstable -> moving -> stable stages
  			 * @track contains array of {x,y} objects
  			 * Key function
  			 * - vectorize track
  			 */
  			match : function(track){

  				a = this.angelize(track);

  				if( this.onMatch )
  					this.onMatch(a);
  		    },

  		    /*
  			 * Fixes applied for:
  			 * > 1x1 matrix
  			 * > previously it returned original distance+1 as distance 
  			 * > [0][0] onwards moves were judged as well
  			 * > [undefined] targets handled
  			 */
  		    levenDistance : function(v1, v2){
  		        d = [];

  		        for( i=0; i < v1.length; i++)
  						d[i] = [];

  				if (v1[0] != v2[0])
  					d[0][0] = 1;
  				else
  					d[0][0] = 0;

  		        for( i=1; i < v1.length; i++)
  		            d[i][0] = d[i-1][0] + 1;

  		        for( j=1; j < v2.length; j++)
  					d[0][j] = d[0][j-1] + 1;

  		        for( i=1; i < v1.length; i++)
  				{
  		            for( j=1; j < v2.length; j++)
  		            {
  		                cost = 0;
  		                if (v1[i] != v2[j])
  		                    cost = 1;

  		                d[i][j] = d[i-1][j] + 1;
  		                if ( d[i][j] > d[i][j-1]+1 ) d[i][j] = d[i][j-1] + 1;
  		                if ( d[i][j] > d[i-1][j-1]+cost ) d[i][j] = d[i-1][j-1] + cost;
  		            }
  				}

  		        return UIIFace.Tools.isEmpty(d[v1.length-1][v2.length-1]) ? 0 : d[v1.length-1][v2.length-1];
  		    },

  			nPairReduce : function(arr, n){
  				var prev = null;
  				var ret = [];

  				n = UIIFace.Tools.isEmpty(n) ? 1 : n;

  				for(var i=0; i<arr.length-n+1; i++){
  					var tmp = arr.slice(i, i+n);
  					var ins = true;

  					for(var j=1; j<tmp.length; j++){
  						if(arr[i] != tmp[j]){
  							ins = false;
  						}
  					}

  					if(ins && prev!=arr[i]){
  						ret.push(arr[i]);
  						prev = arr[i];
  					}
  				}

  				return ret;
  			},


  			onMatch : function (mov){

  				mov = this.nPairReduce(mov,2);
  				cbLen = this.mCallbacks.length;

  				//fix applied for [ undefined ] moves
  				if( cbLen < 1 || mov[0] === undefined)
  					return ;

  				minIndex = 0;
  				minDist = this.levenDistance(mov, this.mGestures[0]);

  		        for(p=1; p<cbLen; p++)
  				{				
  					nwDist = this.levenDistance(mov, this.mGestures[p]);

  					if( nwDist < minDist ){
  						minDist = nwDist;
  						minIndex = p;
  					}
  				}

  				this.mCallbacks[minIndex](minDist/mov.length);
  			}
  		};

  		var gMatcher = new GestureMatcher();
  		var probe    = new Probe(element);
  		var recorder = {};
  		var monitor  = {};

  		return {
  			//Public interface for GestureInterpreter
  			addGesture : function(gesture,callback) {
  				gMatcher.addGesture(gesture, callback);
  			},
  			start : function() {
  				recorder = new Recorder({maxSteps: 50, minSteps: 8, matcher: gMatcher});
  				monitor  = new Monitor(30, 2);

  				monitor.start(probe, recorder);
  			},
  			stop : function() {
  				monitor.stop();
  			}
  		};

  	};

  	/** Speech Interpreter */

  	/** Interaction Manager and trigger */
  	UIIFace.InteractionManager.sketch = function(e) {
  		e.preventDefault();

  		//Fallback for mouse events
          e.streamId = !e.originalEvent.streamId ? 0 : e.originalEvent.streamId;
          //console.log(e.type);
          //console.log(e.streamId);
          var target = e.target || e.srcElement;

  		switch(e.type) {
  			case touchEvents['down']:
  			case 'mousedown':
  				// Create pens if necessary
  	            if(!pens[e.streamId]) {
  	            	//console.log('add pen for id ' + e.streamId);
  	            	pens[e.streamId] = { 
  	            			size: 2,
  	            			color: '90,0,0',
  	            			oldX : 0,
  	            			oldY : 0,
  	            			x    : parseFloat((e.pageX - $(target).offset().left).toFixed(2)),
  	            			y    : parseFloat((e.pageY - $(target).offset().top).toFixed(2))
  	            	};
  	            }  
  				break;
  			case touchEvents['move']:
  			case 'mousemove':
  				//Attach pen information to event and trigger sketch event 
  				if(typeof(pens) !== undefined && e.streamId in pens) {
  					//console.log('moving with id ' + e.streamId);	
  					pens[e.streamId].oldX = pens[e.streamId].x;
  					pens[e.streamId].oldY = pens[e.streamId].y;

  					pens[e.streamId].x = parseFloat((e.pageX - $(target).offset().left).toFixed(2));
  					pens[e.streamId].y = parseFloat((e.pageY - $(target).offset().top).toFixed(2));

  					$(target).trigger('sketch', pens[e.streamId]);
  				}
  				break;
  			case touchEvents['up']:
  			case 'mouseup':
  				//Remove pen
  				if(pens[e.streamId]) {
  					pens.splice(e.streamId,1);
  				}
  				break;
  			case 'mouseout':
  				//Reset all pens
  				pens = new Array();
  				break;
  		}

  		e.stopPropagation(); 
  	};

  	/** Main public functions */
  	UIIFace.initialize = function(options) {
  		
  		uiiOptions = options;
  		UIIFace.CommandMapper();

  	};

  	UIIFace.registerEvent = function(aElement, event, callback, options) {

  		var element = '#' + aElement;

  		if($.inArray(event,eventList) > -1) {

  			//just bind basic browser events needed to create custom events available to I-SEARCH GUI
  			switch(event) {
  				case 'sketch': 
  					if($(element).is('canvas')) {
  						$(element).bind('mousedown' + (touchEvents['down'] !== undefined ? ' ' + touchEvents['down'] : ''),UIIFace.InteractionManager.sketch);
  						$(element).bind('mousemove' + (touchEvents['move'] !== undefined ? ' ' + touchEvents['move'] : ''),UIIFace.InteractionManager.sketch);
  						$(element).bind('mouseup' + (touchEvents['up'] !== undefined ? ' ' + touchEvents['up'] : ''),UIIFace.InteractionManager.sketch);
  						$(element).bind('mouseout',UIIFace.InteractionManager.sketch);
  					} else { 
  						throw 'A sketch event can only be bound to canvas elements.'; 
  					}
  					break;
  				case 'delete':
  					var gi = new UIIFace.GestureInterpreter(element);
  					//gi.addGesture([3,2,1,0,7,6,5,4],callback);
  					gi.addGesture([4,0,4,0],callback);
  					gi.start();
  					break;
  				case 'drop':
  					$(element).bind('dragenter', function(e){ $(element).addClass("over"); e.stopPropagation(); e.preventDefault();});
  					$(element).bind('dragover' , function(e){ e.stopPropagation(); e.preventDefault();},false);
  					$(element).bind('dragleave', function(e){ $(element).removeClass("over"); e.stopPropagation(); e.preventDefault();});
  					break;
  			}
  			//Always register the custom event to the element, as we will trigger
  			//that event in the specialized handler functions
  			if(!$.hasEventListener(element,event)) {
  				$(element).bind(event,callback);
  			}
  			//a clickTarget is defined which means, that the user wants the given
  			//event alternativly triggered on the element provided within clickTarget
  			if(!UIIFace.Tools.isEmpty(options) && !UIIFace.Tools.isEmpty(options.clickTarget)) {
  				$(clickTarget).bind('click',callback);
  			}

  		}
  	};

  })(UIIFace);
  
  return {
    initialize: UIIFace.initialize,
    registerEvent: UIIFace.registerEvent
  };
});

