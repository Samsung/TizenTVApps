
var Main = {};

//called when application was loaded
Main.onLoad = function () {
	console.log("Main.onLoad()");
	
	//enabling media keys
	Main.enableMediaKeys();
	
	// setup handler to key events
	Main.handleKeyDownEvents();
	
	// setup video player
	AVPlayer.init("av-player");
	AVPlayer.prepare("http://yourvideourl.mp4"); // <-- set video URL here!
 
}

// called when application has closed
Main.onUnload = function () {
	console.log("Main.onUnload()");
}

// enabling media keys
Main.enableMediaKeys = function () {	
	console.log("Main.enableMediaKeys()");
	
	tizen.tvinputdevice.registerKey("MediaPlayPause");
	tizen.tvinputdevice.registerKey("MediaPlay");
	tizen.tvinputdevice.registerKey("MediaStop");
	tizen.tvinputdevice.registerKey("MediaPause");
	tizen.tvinputdevice.registerKey("MediaRewind");
	tizen.tvinputdevice.registerKey("MediaFastForward");	
}

// handle all keydown events triggered through remote control.
Main.handleKeyDownEvents = function () {

	// add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	    	
    	switch(e.keyCode){
    	case tvKey.LEFT: //LEFT arrow
        	console.log("LEFT");
    		break;
    	case tvKey.UP: //UP arrow
    		console.log("UP");
    		break;
    	case tvKey.RIGHT: //RIGHT arrow
    		console.log("RIGHT");
    		break;
    	case tvKey.DOWN: //DOWN arrow
    		console.log("DOWN");
    		break;
    	case tvKey.ENTER: //OK button
    		console.log("OK");
    		AVPlayer.setDisplayArea(0, 0, 1920, 1080);
    		break;
    	case tvKey.RETURN: //RETURN button
    		console.log("RETURN");
    		AVPlayer.setDisplayArea(0, 0, 960, 540);
    		break;
    	case tvKey.PLAYPAUSE: // PLAYPAUSE button
    		console.log("PLAYPAUSE");
    		if (AVPlayer.state == AVPlayer.STATES.PLAYING) {
    			AVPlayer.pause();
    		} else {
    			AVPlayer.play();
    		}    		
    		break;
    	case tvKey.PLAY: // PLAY button
    		console.log("PLAY");
    		AVPlayer.play();
    		break;
    	case tvKey.PAUSE: // PAUSE button
    		console.log("PAUSE");
    		AVPlayer.pause();
    		break;
    	default:
    		console.log("Key code : " + e.keyCode);
    		break;
    	}
    });
}

// binding some events
window.onload = Main.onLoad;
window.onunload = Main.onUnload;

/*********************************************** Player *************************************************/

(function(){
	
	var AVPlayer = {
		videoObj: null,	// tag video
		STATES: {
	        STOPPED: 0,
	        PLAYING: 1,
	        PAUSED: 2, 
	        PREPARED: 4
	    },
	    state: 0		// initial state: STOPPED
	};
	
	// Initialize player
	AVPlayer.init = function (id) {
		
		console.log("Player.init("+id+")");
		console.log("AVPlay version: " + webapis.avplay.getVersion());
		
		this.state = this.STATES.STOPPED;
		
		if (!this.videoObj && id) {
			this.videoObj = document.getElementById(id);
		}
	}
	
	// Load video.
	AVPlayer.prepare = function (url) {
		
		console.log("Player.prepare("+url+")");		
		
		if (this.state > this.STATES.STOPPED) {
			return;
		}
		
		if (!this.videoObj) {
			return 0;
		}
		
		webapis.avplay.open(url);
		this.setupEventListeners();
		this.setDisplayArea(0,0,1920,1080);
		webapis.avplay.setStreamingProperty("SET_MODE_4K") //for 4K contents			
		webapis.avplay.prepare();
		
		this.state = this.STATES.PREPARED;
		
		document.getElementById("total-time").innerHTML = this.formatTime(webapis.avplay.getDuration()/1000);		
	}
	
	// Play video
	AVPlayer.play = function (url) {
		
		console.log("Player.play("+url+")");
		
		if (this.state < this.STATES.PAUSED) {
			return;
		}
		
		this.state = this.STATES.PLAYING;
		
		if (url) {
			this.videoObj.src = url;
		}
		
		webapis.avplay.play();		
	}
	
	// Pause video
	AVPlayer.pause = function () {
		
		console.log("Player.pause()");
		
		if (this.state != this.STATES.PLAYING) {
			return;
		}
		
		this.state = this.STATES.PAUSED;
		
		webapis.avplay.pause();
				
	}
	
	// Stop video
	AVPlayer.stop = function () {
		
		console.log("Player.stop()");
		
		this.state = this.STATES.STOPPED;		
		webapis.avplay.stop();
	}
	
	// Set position and dimension of video area 
	AVPlayer.setDisplayArea = function (x, y, width, height) {		
		webapis.avplay.setDisplayRect(x,y,width,height);
	}
	
	// format time in seconds to hh:mm:ss
	AVPlayer.formatTime = function (seconds) {
				
		var hh = Math.floor(seconds / 3600),
   		    mm = Math.floor(seconds / 60) % 60,
		    ss = Math.floor(seconds) % 60;
		  
		return (hh ? (hh < 10 ? "0" : "") + hh + ":" : "") + 
			   ((mm < 10) ? "0" : "") + mm + ":" + 
			   ((ss < 10) ? "0" : "") + ss;			
	}
	
	// Setup Listeners for video player events
	AVPlayer.setupEventListeners = function () {
	
		var that = this;
		
		var listener = {
			onbufferingstart: function() {
				console.log("Buffering...");
			},
			onbufferingprogress: function(percent) {
				console.log("Buffering progress: " + percent);
			},
			onbufferingcomplete: function() {
				console.log('Buffering Complete, Can play now!');
			},
			onstreamcompleted: function() {
				console.log('video has ended.');
				webapis.avplay.stop();
				that.state = that.STATES.STOPPED;
				document.getElementById('progress-amount').style.width = "100%";
			},
			oncurrentplaytime: function(currentTime) {				
				var duration =  webapis.avplay.getDuration();				
			    if (duration > 0) {			    	
			    	var percent = ((currentTime / duration)*100);		    	
			    	document.getElementById('progress-amount').style.width = percent + "%";
			    	document.getElementById("current-time").innerHTML = that.formatTime(currentTime/1000);
			    }		    
			},
			ondrmevent: function(drmEvent, drmData) {
				console.log("DRM callback: " + drmEvent + ", data: " + drmData);
			},			
			onerror : function(type, data) {
				console.log("OnError: " + data);
			}
	    }
		
		webapis.avplay.setListener(listener);
        
	}	
	
	if (!window.AVPlayer) {
		window.AVPlayer = AVPlayer;
	}	
	
})()
